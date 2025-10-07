import { ApiProperty } from "@nestjs/swagger";
import { UUID } from "crypto";
import { Message } from "src/domain/messages/message";
import { User } from "src/domain/users/users";
import { MessageTypeEnum } from "src/infrastructure/relational-database/orm/message.orm";
import { ChatActionEnum } from "src/shared/common/enums/chat-action.enum";
import { SenderOutput } from "./sender.output";

export class MessageOutput{
  @ApiProperty()
  id: UUID;

  // @ApiProperty()
  // userId: UUID;

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

  @ApiProperty()
  sender: SenderOutput

  constructor(
    entity: Message,
    senderUser?: User
  ){
    this.id = entity.id;
    // this.userId = entity.userId;
    this.conversationId = entity.conversationId;
    this.content = entity.content;
    this.type = entity.type;
    this.action = entity.action;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
    if(senderUser) {
      this.sender = new SenderOutput(senderUser);
    }
  }
}