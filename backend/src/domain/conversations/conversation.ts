import { Aggregate } from "../../shared/libs/ddd/aggregate";
import { UserInConversation } from "./entities/user-in-conversation.entity";
import { ConversationTypeEnum } from "src/domain/conversations/enums/conversations.enum";
import { UUID } from "crypto";
import { v4 as uuidv4 } from 'uuid';
import { ConversationTitleVO } from "./value-objects/conversation-name.vo";
import { UserAlreadyInConversationException } from "src/shared/core/exceptions/conflict/user-already-in-conversation.exception";
import { AddToDirectConversationException } from "src/shared/core/exceptions/conflict/add-to-direct-conversation.exception";
import { AddMemberEvent } from "./events/add-member.event";
import { RemoveMemberEvent } from "./events/remove-member.event";
import { UpdateConversationContract } from "./contracts/update-conversation.contract";
import { NotHavePermissionInConversationException } from "src/shared/core/exceptions/forbidden/not-have-permission-in-conversation.exception";
import { UserNotInConversationException } from "src/shared/core/exceptions/forbidden/user-not-in-conversation.exception";
import { ConversationRoleEnum } from "src/domain/conversations/enums/conversation-role.enum";
import { DeleteConversationEvent } from "./events/delete-conversation.event";
import { UpdateMemberContract } from "./contracts/update-member.contract";

export class Conversation extends Aggregate<UUID>{
  private _title: ConversationTitleVO;
  private _type: ConversationTypeEnum;
  private _theme: string;
  private _avatar: string;
  private _userInConversations: UserInConversation[];
  private _owner: UUID;
  private _lastMessage: string;
  private _updatedAt: Date;
  private _createdAt: Date;

  protected constructor(id?: UUID, title?: string, type?: ConversationTypeEnum, theme?: string, avatar?: string, userInConversation?: UserInConversation[], owner?: UUID, lastMessage?: string, createdAt?: Date, updatedAt?: Date){
    super(id);
    this.setTitle(title);
    this.setType(type);
    this.setTheme(theme);
    this.setAvatar(avatar);
    this.setUserInConversations(userInConversation);
    this.setOwner(owner);
    this.setLastMessage(lastMessage);
    this.setCreatedAt(createdAt);
    this.setUpdatedAt(updatedAt);
  }

  static assign(id?: UUID, title?: string, type?: ConversationTypeEnum, theme?: string, avatar?: string, userInConversations?: UserInConversation[], owner?: UUID, lastMessage?: string, createdAt?: Date, updatedAt?: Date){
    const conversation = new Conversation(id, title, type, theme, avatar, userInConversations, owner, lastMessage, createdAt, updatedAt);
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

  addNewMessage(message: string){
    this._lastMessage = message;
  }
  
  requestToView(userId: UUID){
    if(!this.canViewConversation(userId)){
      throw new UserNotInConversationException(userId);
    }
  }

  addMember(addedBy: UUID, addedUser: UUID){
    if(!this.canAddMember(addedBy)){
      throw new NotHavePermissionInConversationException(addedBy, this.id);
    }
    if(this.type === ConversationTypeEnum.DIRECT_CHAT){
      throw new AddToDirectConversationException(this.id, addedUser);
    }
    if(this.isMember(addedUser)){
      throw new UserAlreadyInConversationException(addedUser);
    }
    this._userInConversations.push(UserInConversation.create(this.id, addedUser));
    this.addDomainEvent(new AddMemberEvent(this.id, addedBy, addedUser));
  }

  removeMember(removedBy: UUID, removedUser: UUID){
    if(!this.canRemoveMember(removedBy, removedUser)){
      throw new NotHavePermissionInConversationException(removedBy, this.id);
    }
    if(!this.isMember(removedUser)){
      throw new UserNotInConversationException(removedUser); //-> 409
    }
    this._userInConversations = this._userInConversations.filter(uic => uic.userId !== removedUser);
    this.addDomainEvent(new RemoveMemberEvent(this.id, removedBy, removedUser));
  }

  requestToDelete(deletedBy: UUID){
    if(!this.canDeleteConversation(deletedBy)){
      throw new NotHavePermissionInConversationException(deletedBy, this.id);
    }
    this.addDomainEvent(new DeleteConversationEvent(this.id));
  }

  updateMember(updatedById: UUID, memberId: UUID, contract: UpdateMemberContract){
    if(contract.role){
      this.updateMemberRole(updatedById, memberId, contract.role);
    }
  }

  changeOwner(currentOwnerId: UUID, newOwnerId: UUID){
    if(!this.isOwner(currentOwnerId) || !this.isMember(newOwnerId)){
      throw new NotHavePermissionInConversationException(currentOwnerId, this.id);
    }
    this._owner = newOwnerId;
  }

  private updateMemberRole(updatedById: UUID, memberId: UUID, newRole: ConversationRoleEnum){
    if(!this.canUpdateRole(updatedById, memberId, newRole)){
      throw new NotHavePermissionInConversationException(updatedById, this.id);
    }
    const userInConversation = this.userInConversations.find(uic => uic.userId === memberId);
    userInConversation.setRole(newRole);
  }

  private canViewConversation(memberId: UUID){
    return this.isMember(memberId);
  }

  private canAddMember(addedBy: UUID){
    return this.isMember(addedBy);
  }

  private canRemoveMember(removedBy: UUID, removedUser: UUID){
    return (this.isOwner(removedBy) || this.isAdmin(removedBy)) && (!this.isOwner(removedUser) || !this.isAdmin(removedUser));
  }

  private canUpdateRole(updatedBy: UUID, updatedUser: UUID, newRole: ConversationRoleEnum){
    return this.isOwner(updatedBy) 
      || (this.compareRole(this.getRole(updatedBy), this.getRole(updatedUser)) && this.compareRole(this.getRole(updatedBy), newRole));
  }

  private canDeleteConversation(deletedBy: UUID){
    return this.isOwner(deletedBy) && this.isMember(deletedBy);
  }
  
  private isMember(memberId: UUID){
    return this.userInConversations.some(uic => uic.userId === memberId);
  }

  private isOwner(memberId: UUID){
    return this.owner === memberId;
  }

  private isAdmin(memberId: UUID){
    const userInConversation = this.userInConversations.find(uic => uic.userId === memberId);
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

  get lastMessage(){
    return this._lastMessage;
  }

  private setTitle(title: string){
    this._title = ConversationTitleVO.create(title);
  }

  private setType(type: ConversationTypeEnum){
    this._type = type;
  }

  private setTheme(theme: string){
    this._theme = theme;
  }

  private setAvatar(avatar: string){
    this._avatar = avatar;
  } 

  private setUserInConversations(userInConversations: UserInConversation[]){
    this._userInConversations = userInConversations;
  }

  private setOwner(owner: UUID){
    this._owner = owner;
  }

  private setLastMessage(lastMessage: string){
    this._lastMessage = lastMessage;
  }

  private setCreatedAt(createdAt: Date){
    this._createdAt = createdAt;
  }

  private setUpdatedAt(updatedAt: Date){
    this._updatedAt = updatedAt;
  }
}