import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
} from '@nestjs/common';

import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    console.log('EXCEPTION:', exception);
    console.log(
      'IS HTTP EXCEPTION:',
      exception instanceof HttpException,
    );

    if (exception instanceof HttpException) {
      console.log('STATUS:', exception.getStatus());
      console.log('RESPONSE:', exception.getResponse());
    }

    const isHttpException = exception instanceof HttpException

    const status =
      isHttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      isHttpException ? exception.message
          : 'Internal server error';

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}