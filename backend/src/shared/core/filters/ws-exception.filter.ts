import { ArgumentsHost, Catch } from '@nestjs/common';
import { WsArgumentsHost } from '@nestjs/common/interfaces';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';

@Catch()
export class WebSocketExceptionFilter extends BaseWsExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    // super.catch(exception, host);
    const ctx = host.switchToWs() as WsArgumentsHost;
    const client = ctx.getClient();
    const pattern = ctx.getPattern();
    const data = ctx.getData();

    let message = 'Unknown error';
    if (exception instanceof WsException) {
      message = exception.getError() as string;
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    client.emit('exception', {
      success: false,
      message,
      cause: {
        pattern,
        data,
      },
    });
  }
}
