import { UUID } from "crypto";
import { DomainEvent } from "src/shared/libs/ddd/domain-event";

export class DeleteConversationEvent extends DomainEvent {
  constructor(public readonly conversationId: UUID) {
    super(conversationId, DeleteConversationEvent.name);
  }
}