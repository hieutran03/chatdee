import { AddMemberEventHandler } from "./add-member.event-handler";
import { DeleteMessageEventHandler } from "./delete-message.event-handler";
import { RemoveMemberEventHandler } from "./remove-member.event-handler";
import { UpdateMessageEventHandler } from "./update-message.event-handler";

export const ChatEventsHandlers = [
  AddMemberEventHandler,
  RemoveMemberEventHandler,
  UpdateMessageEventHandler,
  DeleteMessageEventHandler
] 