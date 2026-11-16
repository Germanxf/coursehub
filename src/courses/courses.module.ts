import { Module } from '@nestjs/common';
import { CoursesController } from './courses.controller.js';
import { CoursesService } from './courses.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './entities/course.entity.js';
import { COURSE_REPOSITORY } from './ports/course.repository.js';
import { TypeOrmCourseRepository } from './adapters/typeorm-course.repository.js';
import { UpdateCourseUseCase } from './use-cases/update-course.use-case.js';

@Module({
  imports: [TypeOrmModule.forFeature([Course])],
  controllers: [CoursesController],
  providers: [
    CoursesService,
    UpdateCourseUseCase,
    { provide: COURSE_REPOSITORY, useClass: TypeOrmCourseRepository },
  ],
  exports: [CoursesService],
})
export class CoursesModule {}
