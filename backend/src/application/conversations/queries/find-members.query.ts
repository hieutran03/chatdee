import { UUID } from "crypto";
import { FindMembersInput } from "../dtos/find-members.input";

export class FindMembersQuery{
  constructor(
    public readonly conversationId: UUID,
    public readonly input: FindMembersInput
  ){}
}