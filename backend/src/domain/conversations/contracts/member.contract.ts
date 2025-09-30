import { User } from "src/domain/users/users";
import { UserInConversation } from "../entities/user-in-conversation.entity";

export class MemberContract extends UserInConversation{
  constructor(userInConversation: UserInConversation, user: User){
    super(userInConversation.conversationId, userInConversation.userId, userInConversation.role);
    this.name = user.name;
    this.avatar = user.avatar;
    this.email = user.email;
    this.bornYear = user.bornYear;
  }
  name: string;
  avatar: string;
  email: string;
  bornYear: number;
}