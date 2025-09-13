import { ConversationAdapter } from "./conversation.adapter";
import { UserInConversationAdapter } from "./user-in-conversation.adapter";
import { UserAdapter } from "./user.adapter";

export const adapters = [
  // add adapters here
  UserAdapter,
  ConversationAdapter,
  UserInConversationAdapter
];