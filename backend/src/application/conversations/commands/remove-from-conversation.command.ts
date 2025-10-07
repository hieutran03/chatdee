import { UUID } from "crypto";

export class RemoveFromConversationCommand {
  constructor(
    public readonly removedById: UUID,
    public readonly conversationId: UUID,
    public readonly memberId: UUID,
  ) {}
}