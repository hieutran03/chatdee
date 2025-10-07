import { UUID } from "crypto";
import { DomainEvent } from "src/shared/libs/ddd/domain-event";

export class DeleteMessageEvent extends DomainEvent{
  constructor(
    public readonly userId: UUID,
    public readonly messageId: UUID,
    public readonly conversationId: UUID,
  ){
    super(userId, DeleteMessageEvent.name);
  }
}