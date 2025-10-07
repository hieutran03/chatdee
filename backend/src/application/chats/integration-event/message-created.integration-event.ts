import { UUID } from "crypto";

export class MessageCreatedIntegrationEvent {
  constructor(
    public readonly conversationId: UUID,
    public readonly messageId: UUID,
    public readonly createdAt: Date,
  ){}
}