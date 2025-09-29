import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, Relation } from "typeorm";
import { UserOrm } from "./user.orm";
import { ConversationOrm } from "./conversation.orm";
import { AbstractOrm } from "../abstractions/asbtract.orm";
import { ConversationRoleEnum } from "src/shared/common/enums/conversation-role.enum";

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

  @ManyToOne(() => ConversationOrm, (conversation) => conversation.userInConversations, { onDelete: 'CASCADE', orphanedRowAction: 'delete' })
  @JoinColumn({
    name: 'conversation_id'
  })
  conversation: ConversationOrm;

  @Column({
    type: 'enum',
    enum: ConversationRoleEnum,
    default: ConversationRoleEnum.MEMBER
  })
  role: ConversationRoleEnum;
}