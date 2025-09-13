import { UUID } from "crypto";
import { CreateConversationInput } from "src/application/conversations/dtos/create-conversation.input";

export class CreateConversationCommand{
  constructor(
    public readonly creatorId: UUID,
    public readonly payload: CreateConversationInput
  ) {}
}