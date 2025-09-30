import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional } from "class-validator";
import { UpdateParticipantContract } from "src/domain/conversations/contracts/update-participant.contract";
import { ConversationRoleEnum } from "src/shared/common/enums/conversation-role.enum";

export class UpdateMemberInput {
  @ApiProperty({ enum: ConversationRoleEnum, required: false })
  @IsEnum(ConversationRoleEnum)
  @IsOptional()
  role?: ConversationRoleEnum
  toContract(): UpdateParticipantContract{
    return new UpdateParticipantContract(this.role);
  }
}