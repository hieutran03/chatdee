import { UUID } from "crypto";

export class FindMembersQuery{
  constructor(
    public readonly conversationId: UUID,
  ){}
}