import { DeleteMessageHandler } from "./delete-message.handler";
import { UpdateMessageHandler } from "./update-message.handler";

export const MessageCommandHandlers = [
  UpdateMessageHandler,
  DeleteMessageHandler
]