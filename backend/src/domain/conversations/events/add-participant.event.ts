import { UUID } from "crypto";
import { DomainEvent } from "src/shared/libs/ddd/domain-event";

export class AddParticipantEvent extends DomainEvent{
  constructor(
    public readonly conversationId: UUID,
    public readonly addBy: UUID,
    public readonly addedUser: UUID
  ){
    super(conversationId, AddParticipantEvent.name);
  }
}