import { AppConfigService } from "src/infrastructure/app-config/services/app-config.service";
import { AppConfigEnum } from "src/infrastructure/app-config/enums/app-config.enum";

export function jwtConfigFactory(appConfigService: AppConfigService) {
  const jwtConfig = appConfigService.getConfig(AppConfigEnum.ENCRYPTION);
  return {
    secret: jwtConfig.jwtSecret,
    signOptions: { expiresIn: jwtConfig.jwtExpirationTime }
  };
}