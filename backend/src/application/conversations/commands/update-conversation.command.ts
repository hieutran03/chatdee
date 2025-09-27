import { UUID } from "crypto";
import { UpdateConversationInput } from "../dtos/update-conversation.input";

export class UpdateConversationCommand{
  constructor(
    public readonly conversationId: UUID,
    public readonly payload: UpdateConversationInput
  ) {}
}