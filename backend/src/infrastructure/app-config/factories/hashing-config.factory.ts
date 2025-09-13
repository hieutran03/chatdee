import { AppConfigFactory } from "../abstraction/app-config-factory.interface";
import { IHashing } from "../abstraction/hashing.interface";
import { EnvConfigConstant } from "../env-config.constant";

export class HashingConfigFactory extends AppConfigFactory<IHashing> {
  create(): IHashing {
    return {
      bcryptSaltRounds: this.configService.get<number>(EnvConfigConstant.BCRYPT_SALT_ROUNDS),
    };
  }
}