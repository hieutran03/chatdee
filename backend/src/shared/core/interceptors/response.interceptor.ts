import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseStatusInterceptor implements NestInterceptor {

  
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const environment = process.env.NODE_ENV || 'development';

    const res = context.switchToHttp().getResponse<Response>();
    
    return next.handle().pipe(
      map((response: any) => {
        if (response?.statusCode) {
          res.status(response.statusCode);
        }
        if (environment == "production") {
          response.stack = undefined;
        }
        return response;
      }),
    );
  }
}