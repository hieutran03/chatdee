import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { UpdateMessageContract } from "src/domain/messages/contracts/update-message.contract";

export class UpdateMessagesInput {
  @ApiProperty({
    example: "Hello, how are you?",
    description: "The new content of the message",
  })
  @IsString()
  @IsOptional()
  content?: string;

  toContract(): UpdateMessageContract {
    return new UpdateMessageContract(
      this.content,
    );
  }
}