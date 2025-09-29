import { Injectable } from "@nestjs/common";
import { Server } from "socket.io";

@Injectable()
export class ChatServerWebsocket{
  private server: Server = null;

  setServer(server: Server) {
    if(this.server) throw new Error('Server instance already set');
    this.server = server;
  }

  getServer(): Server {
    return this.server;
  }
}