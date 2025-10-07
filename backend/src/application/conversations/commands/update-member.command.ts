import { UUID } from "crypto";
import { UpdateMemberInput } from "../dtos/update-member.input";

export class UpdateMemberCommand{
  constructor(
    public readonly conversationId: UUID,
    public readonly updatedById: UUID,
    public readonly memberId: UUID,
    public readonly input: UpdateMemberInput
  ){}
}