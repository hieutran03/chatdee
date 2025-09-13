import { User } from "src/domain/users/users";

export class UserOutput {
  id: string;
  role: string;
  name: string;
  bornYear: number;
  email: string;
  avatar: string;
  constructor(entity: User) {
    this.id = entity.id;
    this.role = entity.role;
    this.name = entity.name;
    this.bornYear = entity.bornYear;
    this.email = entity.email;
    this.avatar = entity.avatar;
  }
}