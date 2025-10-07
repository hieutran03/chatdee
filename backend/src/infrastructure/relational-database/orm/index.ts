import { ConversationOrm } from "./conversation.orm";
import { MessageOrm } from "./message.orm";
import { NotificationOrm } from "./notification.orm";
import { UserInConversationOrm } from "./user-in-conversation.orm";
import { UserOrm } from "./user.orm";

export const entities = [
  UserOrm,
  ConversationOrm,
  UserInConversationOrm,
  MessageOrm,
  // NotificationOrm
]