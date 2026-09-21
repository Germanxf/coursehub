import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { PositiveIntPipe } from '../common/pipes/positive-int.pipe.js';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto.js';
import { FilterEnrollmentsDto } from './dto/filter-enrollments.dto.js';
import { EnrollmentsService } from './enrollments.service.js';

@Controller()
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Post('enrollments')
  create(@Body() dto: CreateEnrollmentDto) {
    return this.enrollmentsService.create(dto);
  }

  @Get('enrollments')
  findAll(@Query() filters: FilterEnrollmentsDto) {
    return this.enrollmentsService.findAll(filters);
  }

  @Get('students/:studentId/enrollments')
  findByStudent(@Param('studentId', PositiveIntPipe) studentId: number) {
    return this.enrollmentsService.findByStudent(studentId);
  }

  @Get('courses/:courseId/enrollments')
  findByCourse(@Param('courseId', PositiveIntPipe) courseId: number) {
    return this.enrollmentsService.findByCourse(courseId);
  }

  @Delete('enrollments/:id')
  remove(@Param('id', PositiveIntPipe) id: number) {
    return this.enrollmentsService.remove(id);
  }
}
