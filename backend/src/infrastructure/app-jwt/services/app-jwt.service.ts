import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { IUserToSign } from "src/application/auth/interfaces/user-to-sign.interface";
import { InvalidCredentialsException } from "src/shared/core/exceptions/unauthorized/invallid-credential-exception";

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

  async verifyOrThrow(token: string) {
    const verifiedData = await this.jwtService.verifyAsync(token);
    if(verifiedData.exp * 1000 < Date.now()){
      throw new InvalidCredentialsException();
    }
    return verifiedData;
  }

  async verify(token: string) {
    return this.jwtService.verifyAsync(token);
  }
}