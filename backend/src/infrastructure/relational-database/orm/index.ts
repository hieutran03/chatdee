import { ConversationOrm } from "./conversation.orm";
import { UserInConversationOrm } from "./user-in-conversation.orm";
import { UserOrm } from "./user.orm";

export const entities = [
  UserOrm,
  ConversationOrm,
  UserInConversationOrm,
]