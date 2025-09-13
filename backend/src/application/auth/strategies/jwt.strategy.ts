import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AppConfigService } from 'src/infrastructure/app-config/services/app-config.service';
import { AppConfigEnum } from 'src/infrastructure/app-config/enums/app-config.enum';
import { AuthService } from '../services/auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly appConfigService: AppConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: appConfigService.getConfig(AppConfigEnum.ENCRYPTION).jwtSecret
    });
  }

  async validate(payload) {
    const user = await this.authService.checkValidEmail(payload.email);
    return user;
  }
}