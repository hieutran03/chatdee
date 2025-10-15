import { ArgumentsHost, Catch } from '@nestjs/common';
import { WsArgumentsHost } from '@nestjs/common/interfaces';
import { CoreException } from '../exceptions/core/core.exception';
import { responseErrorResult } from '../utils/exception.util';

@Catch(CoreException)
export class WebSocketExceptionFilter {
  catch(exception: CoreException, host: ArgumentsHost) {
    const ctx = host.switchToWs() as WsArgumentsHost;
    const client = ctx.getClient();
    const pattern = ctx.getPattern();
    const data = ctx.getData();
  
    const errorResult = responseErrorResult(exception);

    client.emit('exception', {
      success: false,
      statusCode: errorResult.statusCode,
      message: errorResult.message,
      code: errorResult.code,
      errors: errorResult.errors,
      cause: {
        pattern,
        data,
      },
    });
  }
}
