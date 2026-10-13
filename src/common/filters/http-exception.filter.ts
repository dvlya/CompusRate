import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { ProblemDetailsDto } from '../dto/problem-details.dto.js';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let detail = 'An unexpected internal error occurred.';

    if (exception instanceof HttpException) {
      status = exception.getStatus();

      // Les erreurs internes ne révèlent pas les détails techniques au client.
      if (status < 500) {
        const exceptionResponse = exception.getResponse();

        if (typeof exceptionResponse === 'string') {
          detail = exceptionResponse;
        } else if ('message' in exceptionResponse) {
          const message = exceptionResponse.message;
          if (typeof message === 'string') {
            detail = message;
          } else if (Array.isArray(message)) {
            detail = message.join('; ');
          }
        }
      }
    }

    const problemDetails: ProblemDetailsDto = {
      type: 'about:blank',
      title: HttpStatus[status] || 'Error',
      status: status,
      detail: detail,
      instance: request.originalUrl,
    };

    response.status(status).type('application/problem+json').json(problemDetails);
  }
}
