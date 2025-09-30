import * as dotenv from 'dotenv';
import * as dotenvExpand from 'dotenv-expand';
import { join } from 'path';
import { entities } from '../../infrastructure/relational-database/orm';
import { DataSource, ConnectionOptionsReader } from 'typeorm';
import { DataSourceOptions } from 'typeorm/browser';
import { SeederOptions } from 'typeorm-extension';
import { MainSeeder } from '../seeding/seeders/main.seeder';

dotenvExpand.expand(dotenv.config());
const devEnvironment = process.env.NODE_ENV !== 'development' ? false : true;

const typeOrmConfig: DataSourceOptions & SeederOptions =  {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT as string) || 5433,
  username: process.env.POSTGRES_USER,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD as string,
  // schema: process.env.POSTGRES_SCHEMA,
  migrationsTableName: 'migrations',
  entities: entities,
  synchronize: false,
  logging: devEnvironment,
  // migrations: [join(__dirname, '..', 'migrations', env.String('POSTGRES_MIGRATION_FOLDER'), '*.{js,ts}')],
  migrations: [join(__dirname, '..', 'migrations', '*.{js,ts}')],
  seeds: [MainSeeder],
  factories: [join(__dirname, '..', 'seeding', 'factories', '*.{js,ts}')],
};
export default new DataSource(typeOrmConfig);