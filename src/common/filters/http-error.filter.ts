import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Request, Response } from 'express';

@Catch()
export class HttpErrorFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const details =
      exception instanceof HttpException ? exception.getResponse() : undefined;
    const detailsObject =
      typeof details === 'object' && details !== null ? details : undefined;
    const message =
      status === HttpStatus.INTERNAL_SERVER_ERROR
        ? 'Internal server error'
        : typeof details === 'string'
          ? details
          : detailsObject && 'message' in detailsObject
            ? detailsObject.message
            : exception instanceof Error
              ? exception.message
              : 'Request failed';
    const error =
      status === HttpStatus.INTERNAL_SERVER_ERROR
        ? 'Internal Server Error'
        : detailsObject && 'error' in detailsObject
          ? detailsObject.error
          : 'Http Error';

    response.status(status).json({
      statusCode: status,
      path: request.url,
      timestamp: new Date().toISOString(),
      message,
      error,
    });
  }
}