import { IChatPublisherToken } from "src/application/chats/publishers/chat-publisher.interface";
import { ChatPublisher } from "./chat.publisher";

export const publishers = [
  {
    provide: IChatPublisherToken,
    useClass: ChatPublisher
  }
];