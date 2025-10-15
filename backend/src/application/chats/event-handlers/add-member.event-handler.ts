import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { AddMemberEvent } from "src/domain/conversations/events/add-member.event";
import { Inject } from "@nestjs/common";
import { MessageTypeEnum } from "src/infrastructure/relational-database/orm/message.orm";
import { ChatActionEnum } from "src/shared/common/enums/chat-action.enum";
import { IMessageRepository, IMessageRepositoryToken } from "src/domain/messages/repositories/message-repository.interface";
import { Message } from "src/domain/messages/message";
import { MessageOutput } from "src/application/messages/dtos/message.output";
import { IUserRepository, IUserRepositoryToken } from "src/domain/users/repositories/user-repository.interface";
import { IChatPublisher, IChatPublisherToken } from "../publishers/chat-publisher.interface";
import { MessageCreatedIntegrationEvent } from "../integration-event/message-created.integration-event";
import { IChatWebsocket, IChatWebsocketToken } from "../websocket/chat-websocket.interface";
import { IConversationRepositoryCache, IConversationRepositoryCacheToken } from "src/application/conversations/cache/conversation-repository-cache.interface";

@EventsHandler(AddMemberEvent)
export class AddMemberEventHandler implements IEventHandler<AddMemberEvent>{
  constructor(
    @Inject(IChatWebsocketToken)
    private readonly chatWebsocket: IChatWebsocket,
    @Inject(IMessageRepositoryToken) 
    private readonly messageRepository: IMessageRepository,
    @Inject(IUserRepositoryToken) 
    private readonly userRepository: IUserRepository,
    @Inject(IChatPublisherToken) 
    private readonly chatPublisher: IChatPublisher,
    @Inject(IConversationRepositoryCacheToken)
    private readonly conversationRepositoryCache: IConversationRepositoryCache
  ) {}
  async handle(event: AddMemberEvent): Promise<void> {
    const savedMessage = await this.saveMessageAndNotify(event);
    await this.updateCache(event);
    await this.chatPublisher.publishMessageCreated(new MessageCreatedIntegrationEvent(
      event.conversationId,
      savedMessage.content,
      savedMessage.createdAt
    ));
  }

  private async saveMessageAndNotify(event: AddMemberEvent){
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
    this.chatWebsocket.send(new MessageOutput(savedMessage, sender));
    return savedMessage;
  }

  private async updateCache(event: AddMemberEvent){
    await this.conversationRepositoryCache.addMember(event.addedUser, event.conversationId);
  }
}