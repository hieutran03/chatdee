import { ConversationTypeEnum } from "../../../shared/common/enums/conversations.enum";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Relation } from "typeorm";
import { AbstractOrm } from "../abstractions/asbtract.orm";
import { UUID } from "crypto";
import { UserOrm } from "./user.orm";
import { UserInConversationOrm } from "./user-in-conversation.orm";

@Entity({ name: 'conversations' })
export class ConversationOrm extends AbstractOrm<ConversationOrm>{
  @PrimaryGeneratedColumn('uuid')
  id: UUID;

  @Column({
    type: 'enum',
    enum: ConversationTypeEnum
  })
  type: ConversationTypeEnum
  
  @Column({
    type: 'varchar',
    length: 100
  })
  title: string;
  
  @Column({
    type: 'text'
  })
  theme: string;

  @Column({
    type: 'text'
  })
  avatar: string;

  @OneToMany(() => UserInConversationOrm, (userInConversation) => userInConversation.conversation, { cascade: true })
  userInConversations: UserInConversationOrm[];

  @ManyToOne(() => UserOrm)
  @JoinColumn({
    name: 'created_by'
  })
  createdBy: UserOrm;

  @Column({
    name: 'created_by',
    type: 'uuid'
  })
  createdById: Relation<UserOrm>['id'];
}