import { UUID } from "crypto";

export class AddToConversationCommand{
  constructor(
    public readonly addedBy: UUID,
    public readonly conversationId: UUID,
    public readonly addedUser: UUID,
  ){}
}