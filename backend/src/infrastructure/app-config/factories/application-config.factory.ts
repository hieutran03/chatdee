import { IApplication } from "../abstraction/application.interface";
import { AppConfigFactory } from "../abstraction/app-config-factory.interface";
import { EnvConfigConstant } from "../env-config.constant";

export class ApplicationConfigFactory extends AppConfigFactory<IApplication> {
  create(): IApplication {
    return {
      port: this.configService.get<number>(EnvConfigConstant.PORT),
      environment: this.configService.get<string>(EnvConfigConstant.NODE_ENV),
    };
  }
}