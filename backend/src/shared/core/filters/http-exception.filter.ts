/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ValidationError } from 'class-validator';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const title = exception.name;
    const statusCode = exception.getStatus();
    const message = exception.message;
    const fields = (exception.getResponse() as any)?.fields
    const errors = (exception.getResponse() as any)?.message as string[] | ValidationError[] | undefined;
    // const traceId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    // const method = ctx.getRequest<Request>().method;
    // const path = ctx.getRequest<Request>().url;
    
    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const isDevelopment = true;

    httpAdapter.reply(
      ctx.getResponse(),
      {
        success: false,
        title,
        statusCode,
        message,
        fields,
        errors,
        // method,
        // path,
        // traceId,
        // timestamp: new Date().toISOString(),
        ...(isDevelopment && { stack: exception.stack }),
      },
      httpStatus,
    );
  }
}