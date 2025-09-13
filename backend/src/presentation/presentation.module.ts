import { Module } from "@nestjs/common";
import { ApplicationModule } from "src/application/application.module";
import { AuthController } from "./auth/controllers/auth.controller";
import { UsersController } from "./users/controllers/users.controller";
import { ConversationController } from "./conversations/controllers/conversations.controller";


@Module({
  imports: [ApplicationModule],
  controllers: [
    AuthController,
    UsersController,
    ConversationController
  ],
})
export class PresentationModule{}