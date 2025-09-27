import { IsEnum, IsString, IsUUID } from "class-validator";
import { UUID } from "crypto";
import { Message } from "src/domain/messages/message";
import { MessageTypeEnum } from "src/infrastructure/relational-database/orm/message.orm";

export class SendMessageInput {
  @IsUUID()
  conversationId: UUID;

  // @IsString()
  // senderId: UUID;
  
  @IsString()
  content: string;
  
  @IsEnum(MessageTypeEnum)
  type: MessageTypeEnum;

  toEntity(senderId: UUID): Message {
    return Message.create(
      senderId,
      this.conversationId,
      this.content,
      this.type
    );
  }
}