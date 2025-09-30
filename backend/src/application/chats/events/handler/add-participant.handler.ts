import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { AddParticipantEvent } from "src/domain/conversations/events/add-participant.event";
import { IChatNotifier, IChatNotifierToken } from "../../ports/chat-notifier.interface";
import { Inject } from "@nestjs/common";
import { MessagePayload } from "../../payload/chat-message.type";
import { MessageTypeEnum } from "src/infrastructure/relational-database/orm/message.orm";
import { ChatActionEnum } from "src/shared/common/enums/chat-action.enum";

@EventsHandler(AddParticipantEvent)
export class AddParticipantHandler implements IEventHandler<AddParticipantEvent>{
  constructor(
    @Inject(IChatNotifierToken)private readonly chatNotifier: IChatNotifier
  ) {}
  handle(event: AddParticipantEvent): void | Promise<void> {
    this.chatNotifier.notify(new MessagePayload(
      event.addBy,
      event.conversationId,
      event.addedUser,
      MessageTypeEnum.NOTIFICATION,
      ChatActionEnum.ADD_PARTICIPANT
    ));
  }
}