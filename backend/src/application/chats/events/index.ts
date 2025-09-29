import { AddParticipantHandler } from "./handler/add-participant.handler";
import { RemoveParticipantHandler } from "./handler/remove-participant.handler";

export const ChatEventsHandlers = [
  AddParticipantHandler,
  RemoveParticipantHandler
]