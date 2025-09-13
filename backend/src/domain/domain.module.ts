import { Module } from "@nestjs/common";
import { DomainServices } from "./domain-service.provider";

@Module({
  providers: [
    ...DomainServices
  ],
  exports: [
    ...DomainServices
  ]
})
export class DomainModule {}