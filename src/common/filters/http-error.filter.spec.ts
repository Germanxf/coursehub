import { ArgumentsHost, BadRequestException } from '@nestjs/common';
import { vi } from 'vitest';
import { HttpErrorFilter } from './http-error.filter.js';

describe('HttpErrorFilter', () => {
  const response = { status: vi.fn(), json: vi.fn() };
  const request = { url: '/courses/invalid' };
  const host = {
    switchToHttp: () => ({
      getResponse: () => response,
      getRequest: () => request,
    }),
  } as unknown as ArgumentsHost;
  let filter: HttpErrorFilter;

  beforeEach(() => {
    vi.clearAllMocks();
    response.status.mockReturnValue(response);
    filter = new HttpErrorFilter();
  });

  it('returns a consistent response for HTTP exceptions', () => {
    filter.catch(new BadRequestException(['Invalid id']), host);

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        path: '/courses/invalid',
        message: ['Invalid id'],
        error: 'Bad Request',
      }),
    );
  });

  it('does not expose unexpected error details', () => {
    filter.catch(new Error('database password leaked'), host);

    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 500,
        message: 'Internal server error',
        error: 'Internal Server Error',
      }),
    );
  });
});