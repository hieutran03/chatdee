import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApplicationConfigFactory } from '../factories/application-config.factory';
import { DatabaseConfigFactory } from '../factories/database-config.factory';
import { EncryptionConfigFactory } from '../factories/encryption-config.factory';
import { HashingConfigFactory } from '../factories/hashing-config.factory';
import { AppConfigEnum } from '../enums/app-config.enum';
import { AppConfigFactory } from '../abstraction/app-config-factory.interface';
import { AppConfigMap } from '../abstraction/app-config-map.interface';

@Injectable()
export class FactoryConfigService {
  constructor(private readonly configService: ConfigService) {}

  createFactory<T extends AppConfigEnum>(
    type: T,
  ): AppConfigFactory<AppConfigMap[T]> {
    switch (type) {
      case AppConfigEnum.APPLICATION:
        return new ApplicationConfigFactory(this.configService) as AppConfigFactory<AppConfigMap[T]>;
      case AppConfigEnum.DATABASE:
        return new DatabaseConfigFactory(this.configService) as AppConfigFactory<AppConfigMap[T]>;
      case AppConfigEnum.ENCRYPTION:
        return new EncryptionConfigFactory(this.configService) as AppConfigFactory<AppConfigMap[T]>;
      case AppConfigEnum.HASHING:
        return new HashingConfigFactory(this.configService) as AppConfigFactory<AppConfigMap[T]>;
      default:
        throw new Error('Invalid config type');
    }
  }
}
