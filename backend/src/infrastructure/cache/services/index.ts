import { IChatServiceCacheToken } from "src/application/chats/cache/chat-service-cache.interface";
import { ChatServiceCache } from "./chat-service.cache";

export const services = [
  {
    provide: IChatServiceCacheToken,
    useClass: ChatServiceCache
  }
]