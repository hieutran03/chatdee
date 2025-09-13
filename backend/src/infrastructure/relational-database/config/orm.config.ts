import { AppConfigService } from "src/infrastructure/app-config/services/app-config.service";
import { entities } from "../orm";
import { DataSourceOptions } from "typeorm";
import { AppConfigEnum } from "src/infrastructure/app-config/enums/app-config.enum";

const devEnvironment = process.env.NODE_ENV !== 'development' ? false : true;

export function getTypeOrmConfig(appConfigService: AppConfigService): DataSourceOptions {
  const databaseConfig = appConfigService.getConfig(AppConfigEnum.DATABASE);
  return {
    type: 'postgres',
    host: databaseConfig.host,
    port: databaseConfig.port,
    username: databaseConfig.username,
    database: databaseConfig.database,
    password: databaseConfig.password,
    // schema: process.env.POSTGRES_SCHEMA,
    migrationsTableName: 'migrations',
    entities: entities,
    synchronize: false,
    logging: devEnvironment,
  };
}