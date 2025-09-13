import { AppConfigFactory } from "../abstraction/app-config-factory.interface";
import { IEncryption } from "../abstraction/encryption.interface";
import { EnvConfigConstant } from "../env-config.constant";

export class EncryptionConfigFactory extends AppConfigFactory<IEncryption>{
  create(): IEncryption {
    return {
      jwtSecret: this.configService.get<string>(EnvConfigConstant.JWT_SECRET),
      jwtExpirationTime: this.configService.get<number>(EnvConfigConstant.JWT_EXPIRATION_TIME),
    };
  }
}