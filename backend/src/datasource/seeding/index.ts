import { DataSource, DataSourceOptions } from "typeorm";
import { typeOrmConfig } from "../configs";
import { factories } from "./factories";
import { MainSeeder } from "./seeders/main.seeder";
import { runSeeders, SeederOptions } from "typeorm-extension";


const options: DataSourceOptions & SeederOptions = {
  ...typeOrmConfig,
  factories: factories,
  seeds: [MainSeeder],
};

const datasource = new DataSource(options);
datasource.initialize().then(async () => {
  await runSeeders(datasource);
  process.exit();
});