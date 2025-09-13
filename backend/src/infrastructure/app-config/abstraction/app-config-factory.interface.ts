import { ConfigService } from "@nestjs/config";

export abstract class AppConfigFactory<T> {
  constructor (protected readonly configService: ConfigService) {}

  abstract create(): T;
}