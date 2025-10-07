import { FindMembersHandler } from "./find-members.handler";
import { FindConversationByIdHandler } from "./find-conversation-by-id.handler";
import { FindConversationsHandler } from "./find-conversations.handler";
export const ConversationQueryHandlers = [
  FindConversationsHandler,
  FindConversationByIdHandler,
  FindMembersHandler
];