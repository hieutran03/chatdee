import { Module } from "@nestjs/common";
import { websocketServers } from "./impl";

@Module({
  providers: [...websocketServers],
  exports: [...websocketServers]
})
export class WebsocketModule{}