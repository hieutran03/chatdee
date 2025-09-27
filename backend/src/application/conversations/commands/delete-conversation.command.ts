import { UUID } from "crypto";

export class DeleteConversationCommand{
  constructor(
    public readonly conversationId: UUID,
  ){}
}