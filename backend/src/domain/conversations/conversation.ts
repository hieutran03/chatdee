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
import { UserNotInConversationException } from "src/shared/core/exceptions/forbidden/user-not-in-conversation.exception";
import { ConversationRoleEnum } from "src/shared/common/enums/conversation-role.enum";
import { DeleteConversationEvent } from "./events/delete-conversation.event";
import { UpdateParticipantContract } from "./contracts/update-participant.contract";

export class Conversation extends Aggregate<UUID>{
  private _title: ConversationTitleVO;
  private _type: ConversationTypeEnum;
  private _theme: string;
  private _avatar: string;
  private _userInConversations: UserInConversation[];
  private _owner: UUID;

  protected constructor(id?: UUID, title?: string, type?: ConversationTypeEnum, theme?: string, avatar?: string, userInConversation?: UserInConversation[], owner?: UUID){
    super(id);
    this.setTitle(title);
    this.setType(type);
    this.setTheme(theme);
    this.setAvatar(avatar);
    this.setUserInConversations(userInConversation);
    this.setOwner(owner);
  }

  static assign(id?: UUID, title?: string, type?: ConversationTypeEnum, theme?: string, avatar?: string, userInConversations?: UserInConversation[], owner?: UUID){
    const conversation = new Conversation(id, title, type, theme, avatar, userInConversations, owner);
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
  
  requestToView(userId: UUID){
    if(!this.canViewConversation(userId)){
      throw new UserNotInConversationException(userId);
    }
  }

  addParticipant(addedBy: UUID, addedUser: UUID){
    if(!this.canAddParticipant(addedBy)){
      throw new NotHavePermissionInConversationException(addedBy, this.id);
    }
    if(this.type === ConversationTypeEnum.DIRECT_CHAT){
      throw new AddToDirectConversationException(this.id, addedUser);
    }
    if(this.isParticipant(addedUser)){
      throw new UserAlreadyInConversationException(addedUser);
    }
    this._userInConversations.push(UserInConversation.create(this.id, addedUser));
    this.addDomainEvent(new AddParticipantEvent(this.id, addedBy, addedUser));
  }

  removeParticipant(removedBy: UUID, removedUser: UUID){
    if(!this.canRemoveParticipant(removedBy, removedUser)){
      throw new NotHavePermissionInConversationException(removedBy, this.id);
    }
    if(!this.isParticipant(removedUser)){
      throw new UserNotInConversationException(removedUser); //-> 409
    }
    this._userInConversations = this._userInConversations.filter(uic => uic.userId !== removedUser);
    this.addDomainEvent(new RemoveParticipantEvent(this.id, removedBy, removedUser));
  }

  requestToDelete(deletedBy: UUID){
    if(!this.canDeleteConversation(deletedBy)){
      throw new NotHavePermissionInConversationException(deletedBy, this.id);
    }
    this.addDomainEvent(new DeleteConversationEvent(this.id));
  }

  updateParticipant(updatedBy: UUID, updatedUser: UUID, contract: UpdateParticipantContract){
    if(contract.role){
      this.updateParticipantRole(updatedBy, updatedUser, contract.role);
    }
  }

  changeOwner(updatedBy: UUID, newOwner: UUID){
    if(!this.isOwner(updatedBy) || !this.isParticipant(newOwner)){
      throw new NotHavePermissionInConversationException(updatedBy, this.id);
    }
    this._owner = newOwner;
  }

  private updateParticipantRole(updatedBy: UUID, updatedUser: UUID, newRole: ConversationRoleEnum){
    if(!this.canUpdateRole(updatedBy, updatedUser, newRole)){
      throw new NotHavePermissionInConversationException(updatedBy, this.id);
    }
    const userInConversation = this.userInConversations.find(uic => uic.userId === updatedUser);
    userInConversation.setRole(newRole);
  }

  private canViewConversation(userId: UUID){
    return this.isParticipant(userId);
  }

  private canAddParticipant(addedBy: UUID){
    return this.isParticipant(addedBy);
  }

  private canRemoveParticipant(removedBy: UUID, removedUser: UUID){
    return (this.isOwner(removedBy) || this.isAdmin(removedBy)) && (!this.isOwner(removedUser) || !this.isAdmin(removedUser));
  }

  private canUpdateRole(updatedBy: UUID, updatedUser: UUID, newRole: ConversationRoleEnum){
    return this.isOwner(updatedBy) 
      || (this.compareRole(this.getRole(updatedBy), this.getRole(updatedUser)) && this.compareRole(this.getRole(updatedBy), newRole));
  }

  private canDeleteConversation(deletedBy: UUID){
    return this.isOwner(deletedBy) && this.isParticipant(deletedBy);
  }
  
  private isParticipant(userId: UUID){
    return this.userInConversations.some(uic => uic.userId === userId);
  }

  private isOwner(userId: UUID){
    return this.owner === userId;
  }

  private isAdmin(userId: UUID){
    const userInConversation = this.userInConversations.find(uic => uic.userId === userId);
    return userInConversation.role === ConversationRoleEnum.ADMIN;
  }

  private compareRole(currentRole: ConversationRoleEnum, roleToCompare: ConversationRoleEnum){
    const rolesHierarchy = [ConversationRoleEnum.MEMBER, ConversationRoleEnum.ADMIN];
    return rolesHierarchy.indexOf(currentRole) > rolesHierarchy.indexOf(roleToCompare);
  }

  private getRole(userId: UUID){
    const userInConversation = this.userInConversations.find(uic => uic.userId === userId);
    return userInConversation.role;
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

   get owner(){
    return this._owner;
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

  setOwner(owner: UUID){
    this._owner = owner;
  }
}