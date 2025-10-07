import { UUID } from "crypto";

export class AddToConversationCommand{
  constructor(
    public readonly addedById: UUID,
    public readonly conversationId: UUID,
    public readonly memberId: UUID,
  ){}
}