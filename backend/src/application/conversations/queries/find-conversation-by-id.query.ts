import { UUID } from "crypto";

export class FindConversationByIdQuery{
  constructor(
    public readonly userId: UUID,
    public readonly conversationId: UUID
  ){}
}