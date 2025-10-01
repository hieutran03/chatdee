import { UUID } from "crypto";
import { UpdateMessagesInput } from "../dtos/update-messages.input";

export class UpdateMessageCommand{
  constructor(
    public readonly userId: UUID,
    public readonly messageId: UUID,
    public readonly conversationId: UUID,
    public readonly input: UpdateMessagesInput
  ){}
}