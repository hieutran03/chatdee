import { Inject } from "@nestjs/common";
import { IAdapter } from "src/shared/common/interfaces/adapter.interface";
import { IUserRepository, IUserRepositoryToken } from "src/domain/users/repositories/user-repository.interface";
import { UserInConversation } from "src/domain/conversations/entities/user-in-conversation.entity";
import { UserInConversationOrm } from "src/infrastructure/relational-database/orm/user-in-conversation.orm";
import { UserAdapter } from "./user.adapter";

export class UserInConversationAdapter implements IAdapter<UserInConversation, UserInConversationOrm>{
  constructor(
    @Inject(IUserRepositoryToken) private readonly userRepository: IUserRepository,
    @Inject(UserAdapter) private readonly userAdapter: UserAdapter,
  ){}
  toEntity(orm: UserInConversationOrm): UserInConversation{
    return UserInConversation.create(
      orm.conversationId,
      orm.userId,
    )
  }

  toOrm(entity: UserInConversation): UserInConversationOrm {
    return new UserInConversationOrm({
      conversationId: entity.conversationId,
      userId: entity.userId,
    })
  }

  async toOrmAsync(entity: UserInConversation): Promise<UserInConversationOrm> {
    const user = await this.userRepository.findById(entity.userId);
    const userOrm = this.userAdapter.toOrm(user);
    return new UserInConversationOrm({
      conversationId: entity.conversationId,
      userId: entity.userId,
      user: userOrm
    })
  }

}