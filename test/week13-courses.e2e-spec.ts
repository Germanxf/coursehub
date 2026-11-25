import { INestApplication, ValidationPipe } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import request from 'supertest';
import { JwtAuthGuard } from '../src/auth/jwt-auth.guard.js';
import { TypeOrmCourseRepository } from '../src/courses/adapters/typeorm-course.repository.js';
import { CoursesController } from '../src/courses/courses.controller.js';
import { CoursesService } from '../src/courses/courses.service.js';
import { Course } from '../src/courses/entities/course.entity.js';
import { COURSE_REPOSITORY } from '../src/courses/ports/course.repository.js';
import { UpdateCourseUseCase } from '../src/courses/use-cases/update-course.use-case.js';

const testJwtSecret = 'week-13-isolated-test-secret-with-32-chars';

describe('Courses HTTP (week 13 e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqljs',
          autoSave: false,
          synchronize: true,
          entities: [Course],
        }),
        TypeOrmModule.forFeature([Course]),
        JwtModule.register({ secret: testJwtSecret }),
      ],
      controllers: [CoursesController],
      providers: [
        JwtAuthGuard,
        CoursesService,
        UpdateCourseUseCase,
        TypeOrmCourseRepository,
        {
          provide: COURSE_REPOSITORY,
          useClass: TypeOrmCourseRepository,
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    jwtService = moduleRef.get(JwtService);
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('serves an empty course collection over HTTP with isolated persistence', async () => {
    const response = await request(app.getHttpServer())
      .get('/courses')
      .expect(200);

    expect(response.body).toEqual({
      items: [],
      meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
    });
  });

  it('rejects a course write without a bearer token', async () => {
    await request(app.getHttpServer())
      .post('/courses')
      .send({ title: 'NestJS avanzado', level: 'avanzado' })
      .expect(401);

  });

  it('rejects an invalid bearer token', async () => {
    await request(app.getHttpServer())
      .post('/courses')
      .set('Authorization', 'Bearer invalid-token')
      .send({ title: 'NestJS avanzado', level: 'avanzado' })
      .expect(401);
  });

  it('rejects an invalid course body over HTTP', async () => {
    const token = await jwtService.signAsync({
      sub: 23,
      email: 'week13@example.test',
      role: 'teacher',
    });

    await request(app.getHttpServer())
      .post('/courses')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: '', level: 'expert' })
      .expect(400);
  });

  it('creates a course with a valid test identity token', async () => {
    const token = await jwtService.signAsync({
      sub: 23,
      email: 'week13@example.test',
      role: 'teacher',
    });

    const response = await request(app.getHttpServer())
      .post('/courses')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'NestJS avanzado', level: 'avanzado' })
      .expect(201);

    expect(response.body).toEqual({
      id: 1,
      title: 'NestJS avanzado',
      level: 'avanzado',
    });

    const listResponse = await request(app.getHttpServer())
      .get('/courses')
      .expect(200);

    expect(listResponse.body.items).toEqual([response.body]);
  });
});