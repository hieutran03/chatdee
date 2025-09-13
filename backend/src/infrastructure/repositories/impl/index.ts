import { IUserRepositoryToken } from "src/domain/abstractions/repositories/user-repository.interface";
import { UserRepository } from "./user.repository";
import { IConversationRepositoryToken } from "src/domain/abstractions/repositories/conversation-repository.interface";
import { IUserInConversationRepositoryToken } from "src/domain/abstractions/repositories/user-in-conversation-repository.interface";
import { UserInCovnersationRepository } from "./user-in-conversation.repository";
import { ConversationRepository } from "./conversation.repository";

export const repositoryTokens = [
  IUserRepositoryToken,
  IConversationRepositoryToken,
  IUserInConversationRepositoryToken
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
    provide: IUserInConversationRepositoryToken,
    useClass: UserInCovnersationRepository
  }
]