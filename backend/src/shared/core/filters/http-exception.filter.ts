/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { CoreException } from '../exceptions/core/core.exception';
import { responseErrorResult } from '../utils/exception.util';

@Catch(CoreException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: CoreException, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const errorResult = responseErrorResult(exception);

    // const traceId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    // const method = ctx.getRequest<Request>().method;
    // const path = ctx.getRequest<Request>().url;

    const isDevelopment = process.env.NODE_ENV === 'development';

    httpAdapter.reply(
      ctx.getResponse(),
      {
        ...errorResult,
        ...(isDevelopment && { stack: exception.stack }),
      },
      errorResult.statusCode || HttpStatus.INTERNAL_SERVER_ERROR ,
    );
  }
}