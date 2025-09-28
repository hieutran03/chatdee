import { Aggregate } from "../../shared/libs/ddd/aggregate";
import { UserInConversation } from "./entities/user-in-conversation.entity";
import { ConversationTypeEnum } from "src/shared/common/enums/conversations.enum";
import { UUID } from "crypto";
import { v4 as uuidv4 } from 'uuid';
import { ConversationTitleVO } from "./value-objects/conversation-name.vo";
import { UserAlreadyInConversationException } from "src/shared/core/exceptions/conflict/user-already-in-conversation.exception";
import { AddToDirectConversationException } from "src/shared/core/exceptions/bussiness/add-to-direct-conversation.exception";
import { AddParticipantEvent } from "./events/add-participant.event";
import { RemoveParticipantEvent } from "./events/remove-participant.event";
import { UpdateConversationContract } from "./contracts/update-conversation.contract";
import { NotHavePermissionInConversationException } from "src/shared/core/exceptions/forbidden/not-have-permission-in-conversation.exception";

export class Conversation extends Aggregate<UUID>{
  private _title: ConversationTitleVO;
  private _type: ConversationTypeEnum;
  private _theme: string;
  private _avatar: string;
  private _userInConversations: UserInConversation[];
  private _createdBy: UUID;

  protected constructor(id?: UUID, title?: string, type?: ConversationTypeEnum, theme?: string, avatar?: string, userInConversation?: UserInConversation[], createdBy?: UUID){
    super(id);
    this.setTitle(title);
    this.setType(type);
    this.setTheme(theme);
    this.setAvatar(avatar);
    this.setUserInConversations(userInConversation);
    this.setCreatedBy(createdBy);
  }

  static assign(id?: UUID, title?: string, type?: ConversationTypeEnum, theme?: string, avatar?: string, userInConversations?: UserInConversation[], createdBy?: UUID){
    const conversation = new Conversation(id, title, type, theme, avatar, userInConversations, createdBy);
    return conversation;
  }

  static create(creatorId: UUID, allUserIds: UUID[], title?: string, theme?: string, avatar?: string){
    const conversationId = uuidv4() as UUID;
    const userInConversation = allUserIds.map(userId => UserInConversation.create(conversationId, userId));
    if(allUserIds.length === 2 )
      return this.createDirectChat(conversationId, userInConversation, theme, creatorId);
    else
      return this.createGroupChat(conversationId, userInConversation, title, theme, avatar, creatorId);
  }

  update(contract: UpdateConversationContract){
    if(contract.title) this.setTitle(contract.title);
    if(contract.theme) this.setTheme(contract.theme);
    if(contract.avatar) this.setAvatar(contract.avatar);
  }

  canViewConversation(userId: UUID){
    return this.isParticipant(userId);
  }
  
  addParticipant(addedBy: UUID, addedUser: UUID){
    if(!this.canAddParticipant(addedBy)){
      throw new NotHavePermissionInConversationException(addedBy, this.id);
    }
    if(this.type === ConversationTypeEnum.DIRECT_CHAT){
      throw new AddToDirectConversationException(this.id, addedUser);
    }
    if(this.checkUserAlreadyInConversation(addedUser)){
      throw new UserAlreadyInConversationException(addedUser);
    }
    this._userInConversations.push(UserInConversation.create(this.id, addedUser));
    this.addDomainEvent(new AddParticipantEvent(this.id, addedUser));
  }

  removeParticipant(removedBy: UUID, removedUser: UUID){
    if(!this.canRemoveParticipant(removedBy)){
      throw new NotHavePermissionInConversationException(removedBy, this.id);
    }
    this._userInConversations = this._userInConversations.filter(uic => uic.userId !== removedUser);
    this.addDomainEvent(new RemoveParticipantEvent(this.id, removedUser));
  }

  private canAddParticipant(userId: UUID){
    return this.isParticipant(userId);
  }

  private canRemoveParticipant(userId: UUID){
    return this.isCreator(userId);
  }
  

  private isParticipant(userId: UUID){
    return this.userInConversations.some(uic => uic.userId === userId);
  }

  private isCreator(userId: UUID){
    return this.createdBy === userId;
  }

  private checkUserAlreadyInConversation(userId: UUID){
    return this.userInConversations.some(uic => uic.userId === userId);
  }
  
  private static createDirectChat(conversationId: UUID, userInConversation?: UserInConversation[], theme?: string, creatorId?: UUID){
    const type = ConversationTypeEnum.DIRECT_CHAT;
    const conversation = Conversation.assign(conversationId, null, type, theme, null, userInConversation, creatorId);
    return conversation;
  }

  private static createGroupChat(conversationId: UUID, userInConversation?: UserInConversation[], title?: string, theme?: string, avatar?: string, creatorId?: UUID){
    const type = ConversationTypeEnum.GROUP_CHAT;
    const conversation = Conversation.assign(conversationId, title, type, theme, avatar, userInConversation, creatorId);
    return conversation;
  }

  get title(){
    return this._title;
  }

  get type(){
    return this._type;
  }

  get theme(){
    return this._theme;
  }

  get avatar(){
    return this._avatar;
  }

  get userInConversations(){
    return this._userInConversations;
  }

   get createdBy(){
    return this._createdBy;
  }

  setTitle(title: string){
    this._title = ConversationTitleVO.create(title);
  }

  setType(type: ConversationTypeEnum){
    this._type = type;
  }

  setTheme(theme: string){
    this._theme = theme;
  }

  setAvatar(avatar: string){
    this._avatar = avatar;
  }

  setUserInConversations(userInConversations: UserInConversation[]){
    this._userInConversations = userInConversations;
  }

  setCreatedBy(createdBy: UUID){
    this._createdBy = createdBy;
  }
}