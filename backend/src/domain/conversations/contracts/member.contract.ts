import { User } from "src/domain/users/users";
import { UserInConversation } from "../entities/user-in-conversation.entity";

export class MemberContract extends UserInConversation{
  constructor(userInConversation: UserInConversation, user: User){
    if(!userInConversation || !user){
      super(undefined, undefined, undefined);
      return;
    }
    super(userInConversation.conversationId, userInConversation.userId, userInConversation.role);
    this.name = user.name;
    this.avatar = user.avatar;
  }
  name: string;
  avatar: string;
}