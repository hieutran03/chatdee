import { UUID } from "crypto";
import { MessageTypeEnum } from "src/infrastructure/relational-database/orm/message.orm";
import { Aggregate } from "src/shared/libs/ddd/aggregate";

export class Message extends Aggregate<UUID>{
  _userId: UUID;
  _conversationId: UUID;
  _content: string;
  _type: MessageTypeEnum;
  _createdAt: Date;
  _updatedAt: Date;

  protected constructor(id: UUID, userId: UUID, conversationId: UUID, content: string, type: MessageTypeEnum, createdAt?: Date, updatedAt?: Date) {
    super(id);
    this._userId = userId;
    this._conversationId = conversationId;
    this._content = content;
    this._type = type;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  static assign(id: UUID, userId: UUID, conversationId: UUID, content: string, type: MessageTypeEnum, createdAt: Date, updatedAt: Date){
    return new Message(id, userId, conversationId, content, type, createdAt, updatedAt);
  }

  static create(userId: UUID, conversationId: UUID, content: string, type: MessageTypeEnum){
    const id = crypto.randomUUID();
    return new Message(id, userId, conversationId, content, type);
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

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }
}