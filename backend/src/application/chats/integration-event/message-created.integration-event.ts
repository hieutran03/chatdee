import { UUID } from "crypto";

export class MessageCreatedIntegrationEvent {
  constructor(
    public readonly conversationId: UUID,
    public readonly lastMessage: string,
    public readonly createdAt: Date,
  ){}
}