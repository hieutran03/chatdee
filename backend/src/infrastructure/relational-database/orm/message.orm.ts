import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Relation, UpdateDateColumn } from "typeorm";
import { AbstractOrm } from "../abstractions/asbtract.orm";
import { UUID } from "crypto";
import { UserOrm } from "./user.orm";
import { ConversationOrm } from "./conversation.orm";

export enum MessageTypeEnum {
  TEXT = 'text',
  IMAGE = 'image',
  VIDEO = 'video',
  FILE = 'file'
}

@Entity({ name: 'messages' })
export class MessageOrm extends AbstractOrm<MessageOrm>{
  @PrimaryGeneratedColumn('uuid')
  id: UUID;

  @Column({
    name: 'user_id',
    type: 'uuid'
  })
  userId: Relation<UserOrm>['id'];

  @JoinColumn({ name: 'user_id' })
  @ManyToOne(() => UserOrm)
  user: Relation<UserOrm>;

  @Column({
    name: 'conversation_id',
    type: 'uuid'
  })
  conversationId: Relation<ConversationOrm>['id'];

  @JoinColumn({ name: 'conversation_id' })
  @ManyToOne(() => ConversationOrm)
  conversation: Relation<ConversationOrm>;

  @Column({
    type: 'text'
  })
  content: string;


  // @Column({
  //   type: 'text',
  //   nullable: true
  // })
  // attachment: string;

  @Column({
    type: 'enum',
    enum: MessageTypeEnum,
    default: MessageTypeEnum.TEXT
  })
  type: MessageTypeEnum;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}