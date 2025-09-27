import { UUID } from "crypto";
import { FindConversationsInput } from "../dtos/find-conversations.input";
export class FindConversationsQuery{
  constructor(
    public readonly userId: UUID,
    public readonly query: FindConversationsInput
  ){}
}