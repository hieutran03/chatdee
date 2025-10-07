import { UUID } from "crypto";

export class ChangeOwnerCommand{
  constructor(
    public readonly currentOwnerId: UUID,
    public readonly conversationId: UUID,
    public readonly newOwnerId: UUID,
  ){}
}