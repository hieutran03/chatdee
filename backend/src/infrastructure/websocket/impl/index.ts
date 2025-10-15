import { IChatWebsocketToken } from "src/application/chats/websocket/chat-websocket.interface";
import { ChatServerWebsocket } from "./chat-server.websocket";

export const websocketServers = [
  {
    provide: IChatWebsocketToken,
    useClass: ChatServerWebsocket
  }
]