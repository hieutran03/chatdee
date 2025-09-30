import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { RemoveParticipantEvent } from "src/domain/conversations/events/remove-participant.event";
import { IChatNotifier, IChatNotifierToken } from "../../ports/chat-notifier.interface";
import { Inject } from "@nestjs/common";
import { MessageTypeEnum } from "src/infrastructure/relational-database/orm/message.orm";
import { ChatActionEnum } from "src/shared/common/enums/chat-action.enum";
import { MessagePayload } from "../../payload/chat-message.type";

@EventsHandler(RemoveParticipantEvent)
export class RemoveParticipantHandler implements IEventHandler<RemoveParticipantEvent>{
  constructor(@Inject(IChatNotifierToken)private readonly chatNotifier: IChatNotifier) {}
  
  handle(event: RemoveParticipantEvent): void | Promise<void> {
    this.chatNotifier.notify(new MessagePayload(
      event.removeBy,
      event.conversationId,
      event.removedUser,
      MessageTypeEnum.NOTIFICATION,
      ChatActionEnum.REMOVE_PARTICIPANT
    ));
  }
}