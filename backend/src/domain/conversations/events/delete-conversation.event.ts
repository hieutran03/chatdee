import { UUID } from "crypto";

export class DeleteConversationEvent{
  constructor(public readonly conversationId: UUID) {}
}