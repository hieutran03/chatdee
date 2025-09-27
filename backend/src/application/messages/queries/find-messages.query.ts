import { UUID } from "crypto";
import { FindMessagesInput } from "../dtos/find-messages.input";

export class FindMessagesQuery{
  constructor(
    public readonly userId: UUID,
    public readonly conversationId: UUID,
    public readonly input: FindMessagesInput
  ){}
}