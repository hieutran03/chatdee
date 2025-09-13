import { UUID } from 'crypto';
import { Entity } from 'src/domain/abstractions/primitives/entity';

export class UserInConversation extends Entity {
  private _conversationId: UUID;
  private _userId: UUID;

  private constructor(conversationId: UUID, userId: UUID) {
    super();
    this.setConversationId(conversationId);
    this.setUserId(userId);
  }

  static create(conversationId: UUID, userId: UUID) {
    return new UserInConversation(conversationId, userId);
  }

  get userId() {
    return this._userId;
  }

  get conversationId() {
    return this._conversationId;
  }

  setConversationId(conversationId: UUID) {
    this._conversationId = conversationId;
  }

  setUserId(userId: UUID) {
    this._userId = userId;
  }

  equals(entity: Entity): boolean {
    if (
      this.userId === (entity as UserInConversation).userId &&
      this.conversationId === (entity as UserInConversation).conversationId
    ) {
      return true;
    }
    return false;
  }
}
