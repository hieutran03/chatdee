import { UUID } from "crypto";
import { DomainEvent } from "src/shared/libs/ddd/domain-event";

export class RemoveParticipantEvent extends DomainEvent {
  constructor(
    public readonly conversationId: UUID,
    public readonly removeBy: UUID,
    public readonly removedUser: UUID
  ) {
    super(conversationId, RemoveParticipantEvent.name);
  }
}
