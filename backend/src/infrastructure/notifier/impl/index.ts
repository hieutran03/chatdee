import { Provider } from "@nestjs/common";
import { IChatNotifierToken } from "src/application/chats/ports/chat-notifier.interface";
import { ChatNotifier } from "./chat.notifier";

export const notifiers: Provider[] = [
  {
    provide: IChatNotifierToken,
    useClass: ChatNotifier
  }
];