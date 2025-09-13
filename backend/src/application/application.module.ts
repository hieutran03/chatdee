import { Module } from "@nestjs/common";
import { DomainModule } from "src/domain/domain.module";
import { CommandHandlers, Mappers, Others, QueryHandlers, Services } from "./application.provider";



@Module({
  imports: [DomainModule],
  providers: [...CommandHandlers, ...QueryHandlers, ...Services, ...Mappers, ...Others],
  exports: [...CommandHandlers, ...QueryHandlers]
})
export class ApplicationModule{}