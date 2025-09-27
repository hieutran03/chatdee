import { UUID } from "crypto";
import { User } from "src/domain/users/users";

export class GetProfileOutput {
  id: UUID;
  email: string;
  name: string;
  role: string;
  bornYear: number;
  avatar: string;

  constructor(entity: User){
    this.id = entity.id;
    this.email = entity.email;
    this.name = entity.name;
    this.role = entity.role;
    this.bornYear = entity.bornYear;
    this.avatar = entity.avatar;
  }
}