import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateCourseDto } from '../dto/update-couerse.dto.js';
import { Course } from '../entities/course.entity.js';
import { COURSE_REPOSITORY } from '../ports/course.repository.js';
import type { CourseRepository } from '../ports/course.repository.js';

@Injectable()
export class UpdateCourseUseCase {
  constructor(
    @Inject(COURSE_REPOSITORY)
    private readonly courses: CourseRepository,
  ) {}

  async execute(id: number, changes: UpdateCourseDto): Promise<Course> {
    const course = await this.courses.findById(id);
    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    Object.assign(course, changes);
    return this.courses.save(course);
  }
}