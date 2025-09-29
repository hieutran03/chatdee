import { Module } from "@nestjs/common";
import { notifiers } from "./impl";

@Module({
  providers: [...notifiers],
  exports: [...notifiers]
})
export class NotifierModule {}