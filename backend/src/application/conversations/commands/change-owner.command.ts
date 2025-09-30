import { UUID } from "crypto";

export class ChangeOwnerCommand{
  constructor(
    public readonly changedBy: UUID,
    public readonly conversationId: UUID,
    public readonly newOwner: UUID,
  ){}
}