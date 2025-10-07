import { MessageOutput } from "src/application/messages/dtos/message.output";


export const IChatNotifierToken = 'IChatNotifier';
export interface IChatNotifier {
  notify(message: MessageOutput): void;
}