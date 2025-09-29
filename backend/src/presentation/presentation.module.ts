import { Module } from "@nestjs/common";
import { ApplicationModule } from "src/application/application.module";
import { AuthController } from "./auth/controllers/auth.controller";
import { UsersController } from "./users/controllers/users.controller";
import { ConversationController } from "./conversations/controllers/conversations.controller";
import { MessageController } from "./messages/controllers/message.controller";
import { ChatGateway } from "./chat/gateways/chat.gateway";


@Module({
  imports: [ApplicationModule],
  providers: [
    ChatGateway
  ],
  controllers: [
    AuthController,
    UsersController,
    ConversationController,
    MessageController
  ],
  
})
export class PresentationModule{}