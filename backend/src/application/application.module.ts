import { Module } from "@nestjs/common";
import { DomainModule } from "src/domain/domain.module";
import { CommandHandlers, EventHandlers, Others, QueryHandlers, Services } from "./application.provider";



@Module({
  imports: [DomainModule],
  providers: [...CommandHandlers, ...QueryHandlers, ...Services, ...EventHandlers,...Others],
  exports: [...CommandHandlers, ...QueryHandlers, ...Services]
})
export class ApplicationModule{}