import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { AppJwtService } from 'src/infrastructure/utils/services/app-jwt.service';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private readonly jwtService: AppJwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const client: Socket = context.switchToWs().getClient<Socket>();

    const token =
      client.handshake.auth?.token ||
      client.handshake.headers?.authorization?.split(' ')[1];

    if (!token) {
      throw new WsException('Missing auth token');
    }

    try {
      const payload = this.jwtService.verify(token);

      // Gán user vào socket để dùng sau này (ví dụ decorator @WsUser)
      client.data.user = payload;

      return true;
    } catch (err) {
      throw new WsException('Invalid or expired token');
    }
  }
}
