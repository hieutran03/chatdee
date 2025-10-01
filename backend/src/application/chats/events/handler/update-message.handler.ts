import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { UpdateMessageEvent } from "src/domain/messages/events/update-message.event";
import { IChatNotifier, IChatNotifierToken } from "../../ports/chat-notifier.interface";
import { Inject } from "@nestjs/common";
import { MessagePayload } from "../../payload/chat-message.type";
import { ChatActionEnum } from "src/shared/common/enums/chat-action.enum";
import { MessageTypeEnum } from "src/infrastructure/relational-database/orm/message.orm";

@EventsHandler(UpdateMessageEvent)
export class UpdateMessageHandler implements IEventHandler<UpdateMessageEvent>{
  constructor(
    @Inject(IChatNotifierToken)
    private readonly notifier: IChatNotifier
  ) {}
  handle(event: UpdateMessageEvent): void | Promise<void> {
    this.notifier.notify(new MessagePayload(
      event.userId,
      event.conversationId,
      event.content,
      MessageTypeEnum.TEXT,
      ChatActionEnum.UPDATE_MESSAGE
    ))
  }
}