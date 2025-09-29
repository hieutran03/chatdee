import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { AddParticipantEvent } from "src/domain/conversations/events/add-participant.event";
import { IChatNotifier, IChatNotifierToken } from "../../ports/chat-notifier.interface";
import { Inject } from "@nestjs/common";

@EventsHandler(AddParticipantEvent)
export class AddParticipantHandler implements IEventHandler<AddParticipantEvent>{
  constructor(@Inject(IChatNotifierToken)private readonly chatNotifier: IChatNotifier) {}
  handle(event: AddParticipantEvent): void | Promise<void> {
    this.chatNotifier.addParticipant({
      conversationId: event.conversationId,
      addedBy: event.addBy,
      addedUser: event.addedUser
    });
  }
}