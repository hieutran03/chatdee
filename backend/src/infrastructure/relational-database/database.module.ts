import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';

import { AppConfigService } from '../app-config/services/app-config.service';
import { AppConfigModule } from '../app-config/app-config.module';
import { getTypeOrmConfig } from './config/orm.config';



@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: getTypeOrmConfig,
      dataSourceFactory: async(options) => {
        if (!options) {
          throw new Error('Invalid options passed');
        }
        return addTransactionalDataSource(new DataSource(options));
      },
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
