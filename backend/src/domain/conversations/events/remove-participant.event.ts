import { UUID } from "crypto";

export class RemoveParticipantEvent {
  constructor(
    public readonly conversationId: UUID,
    public readonly userId: UUID,
  ) {}
}
