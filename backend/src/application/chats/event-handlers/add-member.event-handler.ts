import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { AddMemberEvent } from "src/domain/conversations/events/add-member.event";
import { IChatNotifier, IChatNotifierToken } from "../notifiers/chat-notifier.interface";
import { Inject } from "@nestjs/common";
import { MessageTypeEnum } from "src/infrastructure/relational-database/orm/message.orm";
import { ChatActionEnum } from "src/shared/common/enums/chat-action.enum";
import { IMessageRepository, IMessageRepositoryToken } from "src/domain/messages/repositories/message-repository.interface";
import { Message } from "src/domain/messages/message";
import { MessageOutput } from "src/application/messages/dtos/message.output";
import { IUserRepository, IUserRepositoryToken } from "src/domain/users/repositories/user-repository.interface";

@EventsHandler(AddMemberEvent)
export class AddMemberEventHandler implements IEventHandler<AddMemberEvent>{
  constructor(
    @Inject(IChatNotifierToken)private readonly chatNotifier: IChatNotifier,
    @Inject(IMessageRepositoryToken) private readonly messageRepository: IMessageRepository,
    @Inject(IUserRepositoryToken) private readonly userRepository: IUserRepository
  ) {}
  async handle(event: AddMemberEvent): Promise<void> {
    const sender = await this.userRepository.findById(event.addBy);
    const targetUser = await this.userRepository.findById(event.addedUser);
    const content = `${sender.name} added ${targetUser.name}`;
    const message = Message.create(
      event.addBy,
      event.conversationId,
      content,
      MessageTypeEnum.NOTIFICATION,
      ChatActionEnum.ADD_MEMBER
    );
    const savedMessage = await this.messageRepository.save(message);
    this.chatNotifier.notify(new MessageOutput(savedMessage, sender));
  }
}