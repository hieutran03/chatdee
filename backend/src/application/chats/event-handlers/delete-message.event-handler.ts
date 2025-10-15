import { Inject } from "@nestjs/common";
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { DeleteMessageEvent } from "src/domain/messages/events/delete-message.event";
import { ChatActionEnum } from "src/shared/common/enums/chat-action.enum";
import { MessageTypeEnum } from "src/infrastructure/relational-database/orm/message.orm";
import { Message } from "src/domain/messages/message";
import { MessageOutput } from "src/application/messages/dtos/message.output";
import { IChatWebsocket, IChatWebsocketToken } from "../websocket/chat-websocket.interface";

@EventsHandler(DeleteMessageEvent)
export class  DeleteMessageEventHandler implements IEventHandler<DeleteMessageEvent>{
  constructor(
    @Inject(IChatWebsocketToken)
    private readonly chatWebsocket: IChatWebsocket,
  ){}

  async handle(event: DeleteMessageEvent): Promise<void> {
    const message =  Message.assign(
      event.messageId,
      event.userId,
      event.conversationId,
      null,
      MessageTypeEnum.NOTIFICATION,
      ChatActionEnum.DELETE_MESSAGE
    );
    this.chatWebsocket.send(new MessageOutput(message));
  }
}