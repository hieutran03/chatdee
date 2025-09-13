import { Injectable } from "@nestjs/common";
import { AppConfigEnum } from "../enums/app-config.enum";
import { FactoryConfigService } from "./factory-config.service";
import { AppConfigMap } from "../abstraction/app-config-map.interface";

@Injectable()
export class AppConfigService {
  constructor(private readonly factoryConfigService: FactoryConfigService) {}

  getConfig<T extends AppConfigEnum>(type: T): AppConfigMap[T] {
    const factory = this.factoryConfigService.createFactory(type);
    return factory.create();
  }
}
