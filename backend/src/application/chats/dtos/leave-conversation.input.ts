import { IsUUID } from "class-validator";
import { UUID } from "crypto";

export class LeaveConversationInput {
  @IsUUID()
  conversationId: UUID;
}