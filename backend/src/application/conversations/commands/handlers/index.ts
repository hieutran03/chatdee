import { AddToConversationHandler } from "./add-to-conversation.handler";
import { ChangeOwnerHandler } from "./change-owner.handler";
import { CreateConversationHandler } from "./create-conversation.handler";
import { DeleteConversationHandler } from "./delete-conversation.handler";
import { RemoveFromConversationHandler } from "./remove-from-conversation.handler";
import { UpdateConversationHandler } from "./update-conversation.handler";
import { UpdateMemberHandler } from "./update-member.handler";

export const ConversationCommandHandlers = [
  CreateConversationHandler,
  AddToConversationHandler,
  RemoveFromConversationHandler,
  UpdateConversationHandler,
  DeleteConversationHandler,
  UpdateMemberHandler,
  ChangeOwnerHandler
]