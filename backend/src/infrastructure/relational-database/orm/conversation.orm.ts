import { ConversationTypeEnum } from "../../../shared/common/enums/conversations.enum";
import { Column, CreateDateColumn, UpdateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Relation } from "typeorm";
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
    length: 100,
    nullable: true
  })
  title: string;
  
  @Column({
    type: 'text',
    nullable: true
  })
  theme: string;

  @Column({
    type: 'text',
    nullable: true
  })
  avatar: string;

  @OneToMany(() => UserInConversationOrm, (userInConversation) => userInConversation.conversation, { cascade: true, orphanedRowAction: 'delete' })
  userInConversations: UserInConversationOrm[];

  @ManyToOne(() => UserOrm)
  @JoinColumn({
    name: 'owner',
  })
  owner: UserOrm;

  @Column({
    name: 'owner',
    type: 'uuid'
  })
  ownerId: Relation<UserOrm>['id'];

  @CreateDateColumn({ name: 'created_at', nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt: Date;
}