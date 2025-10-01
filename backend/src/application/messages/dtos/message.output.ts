import { ApiProperty } from "@nestjs/swagger";
import { UUID } from "crypto";
import { Message } from "src/domain/messages/message";
import { MessageTypeEnum } from "src/infrastructure/relational-database/orm/message.orm";
import { ChatActionEnum } from "src/shared/common/enums/chat-action.enum";

export class MessageOutput{
  @ApiProperty()
  id: UUID;

  @ApiProperty()
  userId: UUID;

  @ApiProperty()
  content: string;

  @ApiProperty()
  conversationId: UUID;

  @ApiProperty()
  type: MessageTypeEnum;

  @ApiProperty()
  action: ChatActionEnum;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(
    entity: Message
  ){
    this.id = entity.id;
    this.userId = entity.userId;
    this.conversationId = entity.conversationId;
    this.content = entity.content;
    this.type = entity.type;
    this.action = entity.action;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }
}