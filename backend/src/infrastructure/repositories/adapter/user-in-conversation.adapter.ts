import { IAdapter } from "src/application/abstraction/adapter.interface";
import { UserInConversation } from "src/domain/conversations/entities/user-in-conversation.entity";
import { UserInConversationOrm } from "src/infrastructure/relational-database/orm/user-in-conversation.orm";

export class UserInConversationAdapter implements IAdapter<UserInConversation, UserInConversationOrm>{
  constructor(){}
  toEntity(orm: UserInConversationOrm): UserInConversation{
    return UserInConversation.create(
      orm.userId,
      orm.conversationId
    )
  }

  toOrm(entity: UserInConversation): UserInConversationOrm{
    return new UserInConversationOrm({
      userId: entity.userId,
      conversationId: entity.conversationId
    })
  }
}