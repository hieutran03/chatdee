import { UUID } from "crypto";
import { MessageTypeEnum } from "src/infrastructure/relational-database/orm/message.orm";
import { ChatActionEnum } from "src/shared/common/enums/chat-action.enum";
import { Aggregate } from "src/shared/libs/ddd/aggregate";

export class Message extends Aggregate<UUID>{
  _userId: UUID;
  _conversationId: UUID;
  _content: string;
  _type: MessageTypeEnum;
  _createdAt: Date;
  _updatedAt: Date;
  _action: ChatActionEnum;

  protected constructor(id: UUID, userId: UUID, conversationId: UUID, content: string, type: MessageTypeEnum, action: ChatActionEnum, createdAt?: Date, updatedAt?: Date) {
    super(id);
    this._userId = userId;
    this._conversationId = conversationId;
    this._content = content;
    this._type = type;
    this._action = action;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  static assign(id: UUID, userId: UUID, conversationId: UUID, content: string, type: MessageTypeEnum, action: ChatActionEnum, createdAt: Date, updatedAt: Date){
    return new Message(id, userId, conversationId, content, type, action, createdAt, updatedAt);
  }

  static create(userId: UUID, conversationId: UUID, content: string, type: MessageTypeEnum, action: ChatActionEnum){
    const id = crypto.randomUUID();
    return new Message(id, userId, conversationId, content, type, action);
  }

  setUserId(userId: UUID){
    this._userId = userId;
  }

  setConversationId(conversationId: UUID){
    this._conversationId = conversationId;
  }

  setContent(content: string){
    this._content = content;
  }

  setType(type: MessageTypeEnum){
    this._type = type;
  }

  setAction(action: ChatActionEnum){
    this._action = action;
  }

  setCreatedAt(createdAt: Date){
    this._createdAt = createdAt;
  }

  setUpdatedAt(updatedAt: Date){
    this._updatedAt = updatedAt;
  }

  get userId(): UUID {
    return this._userId;
  }

  get conversationId(): UUID {
    return this._conversationId;
  }

  get content(): string {
    return this._content;
  }

  get type(): MessageTypeEnum {
    return this._type;
  }

  get action(): ChatActionEnum {
    return this._action;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }
}