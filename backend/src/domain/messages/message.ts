import { UUID } from "crypto";
import { MessageTypeEnum } from "src/infrastructure/relational-database/orm/message.orm";
import { ChatActionEnum } from "src/shared/common/enums/chat-action.enum";
import { Aggregate } from "src/shared/libs/ddd/aggregate";
import { UpdateMessageEvent } from "./events/update-message.event";
import { UpdateNonTextMessageException } from "src/shared/core/exceptions/bad-request/update-non-text-message.exception";
import { ModifyOthersMessageException } from "src/shared/core/exceptions/forbidden/modify-others-message.exception";
import { DeleteMessageEvent } from "./events/delete-message.event";

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
    if(createdAt) this._createdAt = createdAt;
    if(updatedAt) this._updatedAt = updatedAt;
  }

  static assign(id: UUID, userId: UUID, conversationId: UUID, content: string, type: MessageTypeEnum, action: ChatActionEnum, createdAt?: Date, updatedAt?: Date){
    return new Message(id, userId, conversationId, content, type, action, createdAt, updatedAt);
  }

  static create(userId: UUID, conversationId: UUID, content: string, type: MessageTypeEnum, action: ChatActionEnum){
    const id = crypto.randomUUID();
    return new Message(id, userId, conversationId, content, type, action);
  }

  update(userId: UUID, content: string){
    if(!this.canModify(userId))
      throw new ModifyOthersMessageException(userId, this.id);
    if(this.type !== MessageTypeEnum.TEXT)
      throw new UpdateNonTextMessageException();
    this.setContent(content);
    this.setAction(ChatActionEnum.UPDATE_MESSAGE);
    this.addDomainEvent(new UpdateMessageEvent(this.id));
  }

  requestToDelete(userId: UUID){
    if(!this.canModify(userId))
      throw new ModifyOthersMessageException(userId, this.id);
    this.addDomainEvent(new DeleteMessageEvent(userId,this.id, this.conversationId));
  }
  
  private canModify(userId: UUID){
    return this.userId === userId 
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