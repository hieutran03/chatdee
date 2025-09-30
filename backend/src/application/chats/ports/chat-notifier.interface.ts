import { MessagePayload } from "../payload/chat-message.type";


export const IChatNotifierToken = 'IChatNotifier';
export interface IChatNotifier {
  notify(message: MessagePayload): void;
}