import { IsUUID } from "class-validator";
import { UUID } from "crypto";

export class JoinChatInput {
  @IsUUID()
  conversationId: UUID;
}