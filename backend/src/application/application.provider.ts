import { AuthCommandHandlers } from "./auth/commands/handlers";
import { UserCommandHandlers } from "./users/commands/handlers";
import { UserQueryHandlers } from "./users/queries/handlers";
import { UserService } from "./users/services/user.service";
import { AuthService } from "./auth/services/auth.service";
import { JwtStrategy } from "./auth/strategies/jwt.strategy";
import { AuthQueryHandlers } from "./auth/queries/handlers";
import { ConversationMappers } from "./conversations/mappers";
import { ConversationCommandHandlers } from "./conversations/commands/handlers";
import { ConversationService } from "./conversations/services/conversation.service";


export const Services = [
  AuthService,
  UserService,
  ConversationService
]


export const CommandHandlers = [
  ...AuthCommandHandlers,
  ...UserCommandHandlers,
  ...ConversationCommandHandlers
]
export const QueryHandlers = [
  ...UserQueryHandlers,
  ...AuthQueryHandlers
]

export const Mappers = [
  ...ConversationMappers
]

export const Others = [
  JwtStrategy
]
