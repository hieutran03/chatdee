import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { AddParticipantEvent } from "src/domain/conversations/events/add-participant.event";
import { IChatNotifier, IChatNotifierToken } from "../../ports/chat-notifier.interface";
import { Inject } from "@nestjs/common";
import { MessagePayload } from "../../payload/chat-message.type";
import { MessageTypeEnum } from "src/infrastructure/relational-database/orm/message.orm";
import { ChatActionEnum } from "src/shared/common/enums/chat-action.enum";
import { IMessageRepository, IMessageRepositoryToken } from "src/domain/messages/repositories/message-repository.interface";

@EventsHandler(AddParticipantEvent)
export class AddParticipantHandler implements IEventHandler<AddParticipantEvent>{
  constructor(
    @Inject(IChatNotifierToken)private readonly chatNotifier: IChatNotifier,
    @Inject(IMessageRepositoryToken) private readonly messageRepository: IMessageRepository
  ) {}
  async handle(event: AddParticipantEvent): Promise<void> {
    const payload = new MessagePayload(
      event.addBy,
      event.conversationId,
      event.addedUser,
      MessageTypeEnum.NOTIFICATION,
      ChatActionEnum.ADD_PARTICIPANT
    )
    const message = payload.toEntity();
    await this.messageRepository.save(message);
    this.chatNotifier.notify(payload);
  }
}