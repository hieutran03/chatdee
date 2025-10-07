import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional } from "class-validator";
import { UpdateMemberContract } from "src/domain/conversations/contracts/update-member.contract";
import { ConversationRoleEnum } from "src/domain/conversations/enums/conversation-role.enum";

export class UpdateMemberInput {
  @ApiProperty({ enum: ConversationRoleEnum, required: false })
  @IsEnum(ConversationRoleEnum)
  @IsOptional()
  role?: ConversationRoleEnum
  toContract(): UpdateMemberContract{
    return new UpdateMemberContract(this.role);
  }
}