import { AddParticipantHandler } from "./handler/add-participant.handler";
import { RemoveParticipantHandler } from "./handler/remove-participant.handler";
import { UpdateMessageHandler } from "./handler/update-message.handler";

export const ChatEventsHandlers = [
  AddParticipantHandler,
  RemoveParticipantHandler,
  UpdateMessageHandler
]