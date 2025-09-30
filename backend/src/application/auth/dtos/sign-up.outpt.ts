import { User } from "src/domain/users/users";

export class SignUpOutput {
  id: string;
  email: string;
  name: string;
  bornYear: number;
  avatar?: string;
  createdAt: Date;

  constructor(user: User){
    this.id = user.id;
    this.email = user.email;
    this.name = user.name;
    this.bornYear = user.bornYear;
    this.avatar = user.avatar;
  }
}