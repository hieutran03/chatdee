import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { IUserToSign } from "src/application/auth/interfaces/user-to-sign.interface";

@Injectable()
export class AppJwtService{
  constructor(
    private readonly jwtService: JwtService
  ){}

  async sign(user: IUserToSign) {
    const payload = { 
      sub: user.id,
      ...user
    };
    return this.jwtService.signAsync(payload);
  }

  async verify(token: string) {
    return this.jwtService.verifyAsync(token);
  }
}