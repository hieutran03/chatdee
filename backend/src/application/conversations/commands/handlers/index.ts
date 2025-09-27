import { AddToConversationHandler } from "./add-to-conversation.handler";
import { CreateConversationHandler } from "./create-conversation.handler";
import { DeleteConversationHandler } from "./delete-conversation.handler";
import { RemoveFromConversationHandler } from "./remove-from-conversation.handler";
import { UpdateConversationHandler } from "./update-conversation.handler";

export const ConversationCommandHandlers = [
  CreateConversationHandler,
  AddToConversationHandler,
  RemoveFromConversationHandler,
  UpdateConversationHandler,
  DeleteConversationHandler
]