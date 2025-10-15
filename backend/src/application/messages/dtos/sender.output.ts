import { UUID } from "crypto";
import { User } from "src/domain/users/users";

export class SenderOutput{
  id: UUID;
  name: string;
  avatar: string;
  constructor(sender: User){
    this.id = sender.id;
    this.name = sender.name;
    this.avatar = sender.avatar;
  }
}