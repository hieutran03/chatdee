import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { RemoveMemberEvent } from "src/domain/conversations/events/remove-member.event";
import { Inject } from "@nestjs/common";
import { MessageTypeEnum } from "src/infrastructure/relational-database/orm/message.orm";
import { ChatActionEnum } from "src/shared/common/enums/chat-action.enum";
import { IMessageRepository, IMessageRepositoryToken } from "src/domain/messages/repositories/message-repository.interface";
import { Message } from "src/domain/messages/message";
import { MessageOutput } from "src/application/messages/dtos/message.output";
import { IChatNotifier, IChatNotifierToken } from "../notifiers/chat-notifier.interface";
import { IUserRepository, IUserRepositoryToken } from "src/domain/users/repositories/user-repository.interface";

@EventsHandler(RemoveMemberEvent)
export class RemoveMemberEventHandler implements IEventHandler<RemoveMemberEvent>{
  constructor(
    @Inject(IChatNotifierToken)private readonly chatNotifier: IChatNotifier,
    @Inject(IMessageRepositoryToken) private readonly messageRepository: IMessageRepository,
    @Inject(IUserRepositoryToken) private readonly userRepository: IUserRepository
  ) {}

  async handle(event: RemoveMemberEvent): Promise<void> {
    const sender = await this.userRepository.findById(event.removeBy);
    const targetUser = await this.userRepository.findById(event.removedUser);
    const content = `${sender.name} removed ${targetUser.name}`;
    const message = Message.create(
      event.removeBy,
      event.conversationId,
      content,
      MessageTypeEnum.NOTIFICATION,
      ChatActionEnum.REMOVE_MEMBER
    );
    const savedMessage = await this.messageRepository.save(message);
    this.chatNotifier.notify(new MessageOutput(savedMessage, sender));
  }
}