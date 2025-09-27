import { UUID } from "crypto";

export class RemoveFromConversationCommand {
  constructor(
    public readonly removedBy: UUID,
    public readonly conversationId: UUID,
    public readonly removedUser: UUID,
  ) {}
}