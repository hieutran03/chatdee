import { UUID } from "crypto";

export class DeleteConversationCommand{
  constructor(
    public readonly userId: UUID,
    public readonly conversationId: UUID,
  ){}
}