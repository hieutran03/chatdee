import { UUID } from 'crypto';
import { ConversationRoleEnum } from 'src/shared/common/enums/conversation-role.enum';
import { Entity } from 'src/shared/libs/ddd/entity';

export class UserInConversation extends Entity {
  private _conversationId: UUID;
  private _userId: UUID;
  private _role: ConversationRoleEnum;

  protected constructor(conversationId: UUID, userId: UUID, role: ConversationRoleEnum) {
    super();
    this.setConversationId(conversationId);
    this.setUserId(userId);
    this.setRole(role);
  }
  static assign(conversationId: UUID, userId: UUID, role: ConversationRoleEnum) {
    return new UserInConversation(conversationId, userId, role);
  }

  static create(conversationId: UUID, userId: UUID) {
    return new UserInConversation(conversationId, userId, ConversationRoleEnum.MEMBER);
  }

  get userId() {
    return this._userId;
  }

  get conversationId() {
    return this._conversationId;
  }

  get role() {
    return this._role;
  }

  setConversationId(conversationId: UUID) {
    this._conversationId = conversationId;
  }

  setUserId(userId: UUID) {
    this._userId = userId;
  }

  setRole(role: ConversationRoleEnum) {
    this._role = role;
  }

  equals(entity: UserInConversation): boolean {
    if (
      this.userId === entity.userId &&
      this.conversationId === entity.conversationId &&
      this.role === entity.role
    ) {
      return true;
    }
    return false;
  }
}
