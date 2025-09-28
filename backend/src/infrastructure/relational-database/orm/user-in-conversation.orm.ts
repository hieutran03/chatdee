import { Entity, JoinColumn, ManyToOne, PrimaryColumn, Relation } from "typeorm";
import { UserOrm } from "./user.orm";
import { ConversationOrm } from "./conversation.orm";
import { AbstractOrm } from "../abstractions/asbtract.orm";

@Entity({ name: 'user_in_conversation_orm' })
export class UserInConversationOrm extends AbstractOrm<UserInConversationOrm>{
  @PrimaryColumn({
    type: 'uuid',
    name: 'user_id'
  })
  userId: Relation<UserOrm>['id'];

  @PrimaryColumn({
    type: 'uuid',
    name: 'conversation_id'
  })
  conversationId: Relation<ConversationOrm>['id'];

  @ManyToOne(() => UserOrm)
  @JoinColumn({
    name: 'user_id'
  })
  user: UserOrm;

  @ManyToOne(() => ConversationOrm, (conversation) => conversation.userInConversations, { onDelete: 'CASCADE'})
  @JoinColumn({
    name: 'conversation_id'
  })
  conversation: ConversationOrm
}