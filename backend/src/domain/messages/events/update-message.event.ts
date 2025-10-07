import { UUID } from "crypto";
import { DomainEvent } from "src/shared/libs/ddd/domain-event";

export class UpdateMessageEvent extends DomainEvent{
  constructor(
    public readonly messageId: UUID,
  ) {
    super(messageId, UpdateMessageEvent.name);
  }
}