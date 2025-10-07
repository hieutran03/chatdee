import { IsUUID } from "class-validator";
import { UUID } from "crypto";

export class LeaveChatInput {
  @IsUUID()
  conversationId: UUID;
}