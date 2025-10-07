import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { UpdateMessageEvent } from "src/domain/messages/events/update-message.event";
import { IChatNotifier, IChatNotifierToken } from "../notifiers/chat-notifier.interface";
import { Inject } from "@nestjs/common";
import { IMessageRepository, IMessageRepositoryToken } from "src/domain/messages/repositories/message-repository.interface";
import { MessageOutput } from "src/application/messages/dtos/message.output";

@EventsHandler(UpdateMessageEvent)
export class UpdateMessageEventHandler implements IEventHandler<UpdateMessageEvent>{
  constructor(
    @Inject(IChatNotifierToken)
    private readonly notifier: IChatNotifier,
    @Inject(IMessageRepositoryToken)
    private readonly messageRepository: IMessageRepository
  ) {}
  async handle(event: UpdateMessageEvent): Promise<void> {
    const message = await this.messageRepository.findById(event.messageId);
    if (!message) return;

    this.notifier.notify(new MessageOutput(message));
  }
}