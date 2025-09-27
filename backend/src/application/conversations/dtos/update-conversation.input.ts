import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { UpdateConversationContract } from "src/domain/conversations/contracts/update-conversation.contract";

export class UpdateConversationInput{
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  theme?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  avatar?: string;

  toContract(): UpdateConversationContract{
    return new UpdateConversationContract(
      this.title,
      this.theme,
      this.avatar
    );
  }
}