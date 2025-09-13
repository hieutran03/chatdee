import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { RoleEnum } from "../../../domain/users/enums/role.enum";
import type { UUID } from "crypto";
import { AbstractOrm } from "../abstractions/asbtract.orm";

@Entity('users')
export class UserOrm extends AbstractOrm<UserOrm> {
  @PrimaryGeneratedColumn('uuid')
  id: UUID;

  @Column({
    type: "enum",
    enum: RoleEnum,
    default: RoleEnum.USER,
    enumName: 'role_enum'
  })
  role: RoleEnum;
  
  @Column({
    name: 'name',
    type: 'varchar',
    length: 100,
  })
  name: string;

  @Column({
    name: 'born_year',
    type: 'int',
  })
  bornYear: number;

  @Column({
    name: 'email',
    type: 'varchar',
    length: 100,
    unique: true
  })
  email: string;

  @Column({
    name: 'avatar',
    type: 'varchar',
    length: 255,
  })
  avatar: string;

  @Column({
    name: 'hashed_password',
  })
  hashedPassword: string;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
  })
  deletedAt: Date;
}