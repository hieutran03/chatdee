import { IAdapter } from "src/shared/common/interfaces/adapter.interface";
import { UserInConversation } from "src/domain/conversations/entities/user-in-conversation.entity";
import { UserInConversationOrm } from "src/infrastructure/relational-database/orm/user-in-conversation.orm";

export class UserInConversationAdapter implements IAdapter<UserInConversation, UserInConversationOrm>{
  toEntity(orm: UserInConversationOrm): UserInConversation{
    return UserInConversation.assign(
      orm.conversationId,
      orm.userId,
      orm.role
    )
  }

  toOrm(entity: UserInConversation): UserInConversationOrm {
    return new UserInConversationOrm({
      conversationId: entity.conversationId,
      userId: entity.userId,
      role: entity.role
    })
  }
}