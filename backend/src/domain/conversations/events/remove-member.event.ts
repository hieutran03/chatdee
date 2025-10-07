import { UUID } from "crypto";
import { DomainEvent } from "src/shared/libs/ddd/domain-event";

export class RemoveMemberEvent extends DomainEvent {
  constructor(
    public readonly conversationId: UUID,
    public readonly removeBy: UUID,
    public readonly removedUser: UUID
  ) {
    super(conversationId, RemoveMemberEvent.name);
  }
}
