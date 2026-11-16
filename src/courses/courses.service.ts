import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCourseDto } from './dto/create-course.dto.js';
import { Course } from './entities/course.entity.js';
import { CoursesQueryDto } from './dto/courses-query.dto.js';

@Injectable()
export class CoursesService {
  // Inyectamos el repositorio para conectar con PostgreSQL y TypeORM
  constructor(
    @InjectRepository(Course) 
    private readonly courseRepository: Repository<Course>
  ) {}

  // GET: Devuelve colección paginada con items y meta
  async findAll(query: CoursesQueryDto = new CoursesQueryDto()) {
    const { level, page = 1, limit = 10, sortBy = 'id', order = 'ASC' } = query;
    const [items, total] = await this.courseRepository.findAndCount({
      where: level ? { level } : {},
      order: { [sortBy]: order },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // GET por ID: Devuelve un curso específico o lanza error 404 (Requisito de etapa)
  async findOne(id: number): Promise<Course> {
    const course = await this.courseRepository.findOneBy({ id });
    
    // Centralizamos la decisión de error en el servicio
    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
    
    return course;
  }

  // POST: Crea y persiste el recurso en PostgreSQL
  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    const newCourse = this.courseRepository.create(createCourseDto);
    return await this.courseRepository.save(newCourse);
  }

  // DELETE: Elimina un curso
  async remove(id: number): Promise<Course> {
    // Buscamos el curso primero para devolverlo y asegurarnos de que exista
    const course = await this.findOne(id);
    await this.courseRepository.remove(course);
    return course;
  }
}