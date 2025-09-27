import { AddParticipantHandler } from "./handler/add-participant.handler";
import { DeleteConversationHandler } from "./handler/delete-conversation.handler";
import { RemoveParticipantHandler } from "./handler/remove-participant.handler";

export const ConversationEventHandlers = [
  AddParticipantHandler,
  RemoveParticipantHandler,
  DeleteConversationHandler
]