import { User } from "src/domain/users/users";
import { Message } from "../message";

export class MessageDetailContract extends Message{
  sender: User;
  constructor(message: Message, sender: User){
    super(message.id, message.userId, message.conversationId, message.content, message.type, message.action, message.createdAt, message.updatedAt); 
    this.sender = sender;
  }
}