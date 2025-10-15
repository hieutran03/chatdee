import { MessageOutput } from "src/application/messages/dtos/message.output";


export const IChatWebsocketToken = 'IChatWebsocket';
export interface IChatWebsocket {
  send(message: MessageOutput): void;
  notifyInbox(userId: string, message: MessageOutput): void;
  removeClientsFromConversation(socketIds: string[], conversationId: string): void;
}