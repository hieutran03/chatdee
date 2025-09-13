import { Module } from '@nestjs/common';
import { AppConfigService } from './services/app-config.service';
import { ConfigModule } from '@nestjs/config';
import { envValidationSchema } from './env.validate';
import { FactoryConfigService } from './services/factory-config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/.env.${process.env.NODE_ENV?.trim()}`,
      // isGlobal: true,
      // load: [configuration],
      validationSchema: envValidationSchema,
    }),
  ],
  providers: [AppConfigService, FactoryConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {}
