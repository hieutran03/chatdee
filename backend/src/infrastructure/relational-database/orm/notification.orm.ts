import { UUID } from "crypto";
import { AbstractOrm } from "../abstractions/asbtract.orm";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserOrm } from "./user.orm";

@Entity({ name: 'notifications' })
export class NotificationOrm extends AbstractOrm<NotificationOrm>{
  @PrimaryGeneratedColumn('uuid')
  id: UUID;

  @Column({
    type: 'text'
  })
  path: string;

  @Column({
    type: 'uuid',
    name: 'receiverId'
  })
  receiverId: UUID;

  @ManyToOne(() => UserOrm)
  @JoinColumn({ name: 'receiverId' })
  receiver: UserOrm;

  @Column({
    type: 'text'
  })
  content: string;

  @Column({
    type: 'boolean'
  })
  isRead: boolean;

  @CreateDateColumn({ name: 'created_at', nullable: true })
  createdAt: Date;
}