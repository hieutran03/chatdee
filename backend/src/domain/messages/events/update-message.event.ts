import { UUID } from "crypto";
import { DomainEvent } from "src/shared/libs/ddd/domain-event";

export class UpdateMessageEvent extends DomainEvent{
  constructor(
    public readonly userId: UUID,
    public readonly messageId: UUID,
    public readonly conversationId: UUID,
    public readonly content: string,
  ) {
    super(messageId, UpdateMessageEvent.name);
  }
}