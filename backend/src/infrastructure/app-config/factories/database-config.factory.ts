import { AppConfigFactory } from "../abstraction/app-config-factory.interface";
import { IDatabase } from "../abstraction/database.interface";
import { EnvConfigConstant } from "../env-config.constant";


export class DatabaseConfigFactory extends AppConfigFactory<IDatabase> {
  create(): IDatabase {
    return {
      host: this.configService.get<string>(EnvConfigConstant.DB_HOST),
      port: this.configService.get<number>(EnvConfigConstant.DB_PORT),
      username: this.configService.get<string>(EnvConfigConstant.DB_USERNAME),
      password: this.configService.get<string>(EnvConfigConstant.DB_PASSWORD),
      database: this.configService.get<string>(EnvConfigConstant.DB_NAME),
    };
  }
}