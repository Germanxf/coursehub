import type { NextFunction, Request, Response } from 'express';
import { Injectable, type NestMiddleware } from '@nestjs/common';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  use(request: Request, response: Response, next: NextFunction): void {
    const startedAt = Date.now();

    response.on('finish', () => {
      console.log({
        method: request.method,
        path: request.path,
        status: response.statusCode,
        durationMs: Date.now() - startedAt,
      });
    });

    next();
  }
}