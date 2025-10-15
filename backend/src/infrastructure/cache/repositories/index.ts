import { IConversationRepositoryCacheToken } from "src/application/conversations/cache/conversation-repository-cache.interface";
import { ConversationRepositoryCache } from "./conversation-repository.cache";


export const repositories = [
  {
    provide: IConversationRepositoryCacheToken,
    useClass: ConversationRepositoryCache,
  }
]