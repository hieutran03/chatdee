import { IsUUID } from "class-validator";
import { UUID } from "crypto";

export class JoinConversationInput {
  @IsUUID()
  conversationId: UUID;
}