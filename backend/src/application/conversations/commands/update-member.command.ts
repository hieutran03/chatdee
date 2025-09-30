import { UUID } from "crypto";
import { UpdateMemberInput } from "../dtos/update-member.input";

export class UpdateMemberCommand{
  constructor(
    public readonly conversationId: UUID,
    public readonly updatedBy: UUID,
    public readonly updatedUser: UUID,
    public readonly input: UpdateMemberInput
  ){}
}