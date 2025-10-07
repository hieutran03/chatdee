import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AppConfigService } from "../app-config/services/app-config.service";
import { jwtConfigFactory } from "./factories/jwt-config.factory";
import { AppJwtService } from "./services/app-jwt.service";


@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [AppConfigService],
      useFactory: jwtConfigFactory
    })
  ],
  providers: [
    AppJwtService,
  ],
  exports: [
    AppJwtService,

  ]
})
export class AppJwtModule {}