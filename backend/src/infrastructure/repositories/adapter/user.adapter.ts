import { IAdapter } from "src/shared/common/interfaces/adapter.interface";
import { User } from "src/domain/users/users";
import { UserOrm } from "src/infrastructure/relational-database/orm/user.orm";

export class UserAdapter implements IAdapter<User, UserOrm>{
  constructor(){}
  toEntity(orm: UserOrm){
    if(!orm) return null;
    return User.create(
      orm.id,
      orm.role,
      orm.name,
      orm.bornYear,
      orm.email,
      orm.avatar,
      orm.hashedPassword
    );
  }

  toOrm(entity: User){
    if(!entity) return null;
    return new UserOrm({
      // id: entity?._id,
      role: entity.role,
      name: entity.name,
      bornYear: entity.bornYear,
      email: entity.email,
      avatar: entity.avatar,
      hashedPassword: entity.hashedPassword, 
    })
  }
}