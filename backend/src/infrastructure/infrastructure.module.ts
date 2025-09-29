import { Global, Module } from '@nestjs/common';
import { DatabaseModule } from './relational-database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from './relational-database/orm';
import { CqrsModule } from '@nestjs/cqrs';
import { RepositoryModule } from './repositories/repository.module';
import { AppConfigModule } from './app-config/app-config.module';
import { AppJwtModule } from './utils/app-jwt.module';
import { PassportModule } from '@nestjs/passport/dist/passport.module';
import { WebsocketModule } from './websocket/websocket.module';
import { NotifierModule } from './notifier/notifier.module';

@Global()
@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature(entities),
    CqrsModule,
    RepositoryModule,
    AppConfigModule,
    AppJwtModule,
    PassportModule,
    WebsocketModule,
    NotifierModule
  ],
  exports: [
    TypeOrmModule,
    DatabaseModule,
    CqrsModule,
    RepositoryModule,
    AppConfigModule,
    AppJwtModule,
    PassportModule,
    WebsocketModule,
    NotifierModule
  ],
})
export class InfrastructureModule {}
