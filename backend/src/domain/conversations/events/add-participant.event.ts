import { UUID } from "crypto";

export class AddParticipantEvent{
  constructor(
    public readonly conversationId: UUID,
    public readonly userId: UUID
  ){}
}