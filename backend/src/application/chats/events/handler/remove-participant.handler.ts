import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { RemoveParticipantEvent } from "src/domain/conversations/events/remove-participant.event";
import { IChatNotifier, IChatNotifierToken } from "../../ports/chat-notifier.interface";
import { Inject } from "@nestjs/common";

@EventsHandler(RemoveParticipantEvent)
export class RemoveParticipantHandler implements IEventHandler<RemoveParticipantEvent>{
  constructor(@Inject(IChatNotifierToken)private readonly chatNotifier: IChatNotifier) {}
  
  handle(event: RemoveParticipantEvent): void | Promise<void> {
    this.chatNotifier.removeParticipant({
      conversationId: event.conversationId,
      removedBy: event.removeBy,
      removedUser: event.removedUser
    });
  }
}