import { CanActivate, ExecutionContext, Injectable, UseFilters } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { AppJwtService } from 'src/infrastructure/app-jwt/services/app-jwt.service';
import { InvalidCredentialsException } from 'src/shared/core/exceptions/unauthorized/invallid-credential-exception';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private readonly jwtService: AppJwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: Socket = context.switchToWs().getClient<Socket>();

    const token =
      client.handshake.auth?.token ||
      client.handshake.headers?.authorization?.split(' ')[1];

    if (!token) {
      throw new InvalidCredentialsException();
    }

    const payload = await this.jwtService.verifyOrThrow(token);

    // Gán user vào socket để dùng sau này (ví dụ decorator @WsUser)
    client.data.user = payload;

    return true;
  
  }
}
