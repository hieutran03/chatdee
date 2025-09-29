import { AuthCommandHandlers } from "./auth/commands/handlers";
import { UserCommandHandlers } from "./users/commands/handlers";
import { UserQueryHandlers } from "./users/queries/handlers";
import { UserService } from "./users/services/user.service";
import { AuthService } from "./auth/services/auth.service";
import { JwtStrategy } from "./auth/strategies/jwt.strategy";
import { AuthQueryHandlers } from "./auth/queries/handlers";
import { ConversationCommandHandlers } from "./conversations/commands/handlers";
import { ConversationService } from "./conversations/services/conversation.service";
import { ConversationQueryHandlers } from "./conversations/queries/handlers";
import { ChatService } from "./chats/services/chat.service";
import { MessageService } from "./messages/services/message.service";
import { MessageQueryHandlers } from "./messages/queries";
import { ChatEventsHandlers } from "./chats/events";


export const Services = [
  AuthService,
  UserService,
  ConversationService,
  ChatService, 
  MessageService
]


export const CommandHandlers = [
  ...AuthCommandHandlers,
  ...UserCommandHandlers,
  ...ConversationCommandHandlers
]
export const QueryHandlers = [
  ...UserQueryHandlers,
  ...AuthQueryHandlers,
  ...ConversationQueryHandlers,
  ...MessageQueryHandlers
]

export const EventHandlers = [
  ...ChatEventsHandlers
]

export const Others = [
  JwtStrategy,
]