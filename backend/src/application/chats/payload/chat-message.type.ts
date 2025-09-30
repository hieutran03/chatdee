import { UUID } from "crypto";
import { Message } from "src/domain/messages/message";
import { MessageTypeEnum } from "src/infrastructure/relational-database/orm/message.orm";
import { ChatActionEnum } from "src/shared/common/enums/chat-action.enum";

export class MessagePayload{
  userId: UUID;
  conversationId: UUID;
  content: string;
  type: MessageTypeEnum;
  action: ChatActionEnum;

  constructor(
    userId: UUID,
    conversationId: UUID,
    content: string,
    type: MessageTypeEnum,
    action: ChatActionEnum
  ){
    this.userId = userId;
    this.conversationId = conversationId;
    this.content = content;
    this.type = type;
    this.action = action;
  }

  toEntity(): Message{
    return Message.create(
      this.userId,
      this.conversationId,
      this.content,
      this.type,
      this.action
    );
  }
}