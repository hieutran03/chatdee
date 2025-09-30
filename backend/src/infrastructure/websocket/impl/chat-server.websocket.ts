import { Injectable } from "@nestjs/common";
import { Server } from "socket.io";

@Injectable()
export class ChatServerWebsocket{
  private server: Server = null;

  setServer(server: Server) {
    if(this.server) throw new Error('Server instance already set'); //-> Exception
    this.server = server;
  }

  getServer(): Server {
    return this.server;
  }

  to(room: string) {
    if(!this.server) throw new Error('Server instance not set');
    return this.server.to(room);
  }

  emit(event: string, ...args: any[]) {
    if(!this.server) throw new Error('Server instance not set');
    this.server.emit(event, ...args);
  }
}