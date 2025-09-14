import { Aggregate } from "../abstractions/primitives/aggregate";
import { UserInConversation } from "./entities/user-in-conversation.entity";
import { ConversationTypeEnum } from "src/shared/common/enums/conversations.enum";
import { UUID } from "crypto";
import { v4 as uuidv4 } from 'uuid';
import { ConversationTitleVO } from "./value-objects/conversation-name.vo";

export class Conversation extends Aggregate<UUID>{
  private _title: ConversationTitleVO;
  private _type: ConversationTypeEnum;
  private _theme: string;
  private _avatar: string;
  private _userInConversations: UserInConversation[];
  private _createdBy: UUID;

  private constructor(id?: UUID, title?: string, type?: ConversationTypeEnum, theme?: string, avatar?: string, userInConversation?: UserInConversation[], createdBy?: UUID){
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