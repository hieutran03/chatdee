import { IAdapter } from "src/application/abstraction/adapter.interface";
import { UserInConversation } from "src/domain/conversations/entities/user-in-conversation.entity";
import { UserInConversationOrm } from "src/infrastructure/relational-database/orm/user-in-conversation.orm";

export class UserInConversationAdapter implements IAdapter<UserInConversation, UserInConversationOrm>{
  constructor(){}
  toEntity(orm: UserInConversationOrm): UserInConversation{
    return UserInConversation.create(
      orm.conversationId,
      orm.userId,
    )
  }

  toOrm(entity: UserInConversation): UserInConversationOrm{
    return new UserInConversationOrm({
      conversationId: entity.conversationId,
      userId: entity.userId,
    })
  }
}