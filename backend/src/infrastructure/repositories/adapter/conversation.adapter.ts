import { Conversation } from "src/domain/conversations/conversation";
import { ConversationOrm } from "src/infrastructure/relational-database/orm/conversation.orm";
import { Inject, Injectable } from "@nestjs/common";
import { IAdapter } from "src/shared/common/interfaces/adapter.interface";
import { UserInConversationOrm } from "src/infrastructure/relational-database/orm/user-in-conversation.orm";
import { UserInConversation } from "src/domain/conversations/entities/user-in-conversation.entity";
import { UserInConversationAdapter } from "./user-in-conversation.adapter";

@Injectable()
export class ConversationAdapter implements IAdapter<Conversation, ConversationOrm>{
  constructor(
    @Inject(UserInConversationAdapter)private readonly userInConversationAdapter: IAdapter<UserInConversation, UserInConversationOrm>
  ){}
  toEntity(orm: ConversationOrm): Conversation {
    const userInConversations = orm.userInConversations?.map(uic => this.userInConversationAdapter.toEntity(uic));
    return Conversation.assign(
      orm.id,
      orm.title,
      orm.type,
      orm.theme,
      orm.avatar,
      userInConversations,
      orm.createdById
    )
  }
  toOrm(entity: Conversation): ConversationOrm {
    return new ConversationOrm({
      id: entity?.id,
      title: entity?.title?.value,
      type: entity?.type,
      theme: entity?.theme,
      avatar: entity?.avatar,
      userInConversations: entity?.userInConversations?.map(uic => this.userInConversationAdapter.toOrm(uic)),
      createdById: entity?.createdBy
    })
  }
  async toOrmAsync(entity: Conversation): Promise<ConversationOrm> {
    const userInConversationOrms = await Promise.all(entity?.userInConversations?.map(uic => this.userInConversationAdapter.toOrmAsync(uic)) || []);
    return new ConversationOrm({
      id: entity?.id,
      title: entity?.title?.value,
      type: entity?.type,
      theme: entity?.theme,
      avatar: entity?.avatar,
      userInConversations: userInConversationOrms,
      createdById: entity?.createdBy
    });
  }
}