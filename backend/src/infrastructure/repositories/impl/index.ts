import { IUserRepositoryToken } from "src/domain/users/repositories/user-repository.interface";
import { UserRepository } from "./user.repository";
import { IConversationRepositoryToken } from "src/domain/conversations/repositories/conversation-repository.interface";

import { ConversationRepository } from "./conversation.repository";
import { IMessageRepositoryToken } from "src/domain/messages/repositories/message-repository.interface";
import { MessageRepository } from "./message.repository";

export const repositoryTokens = [
  IUserRepositoryToken,
  IConversationRepositoryToken,
  IMessageRepositoryToken
];

export const repositories = [
  {
    provide: IUserRepositoryToken,
    useClass: UserRepository
  },
  {
    provide: IConversationRepositoryToken,
    useClass: ConversationRepository
  },
  {
    provide: IMessageRepositoryToken,
    useClass: MessageRepository
  }
]