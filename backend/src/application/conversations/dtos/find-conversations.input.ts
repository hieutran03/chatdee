import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { CursorBasedQueryDto } from "src/shared/common/dtos/cursor-based-query.dto";
type conversationInclude = "topMembers" | "totalMembers";
export class FindConversationsInput extends CursorBasedQueryDto {
  @ApiProperty({
    type: [String],
    enum: ["topMembers", "totalMembers"],
    required: false,
    example: ["topMembers", "totalMembers"],
    description: "Include additional information in the response",
  })
  @IsString({ each: true })
  @IsOptional()
  include?: conversationInclude[];
}