import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { RemoveMemberEvent } from "src/domain/conversations/events/remove-member.event";
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
import { UUID } from "crypto";
import { IChatServiceCache, IChatServiceCacheToken } from "../cache/chat-service-cache.interface";
import { IConversationRepositoryCache, IConversationRepositoryCacheToken } from "src/application/conversations/cache/conversation-repository-cache.interface";

@EventsHandler(RemoveMemberEvent)
export class RemoveMemberEventHandler implements IEventHandler<RemoveMemberEvent>{
  constructor(
    @Inject(IChatWebsocketToken) 
    private readonly chatWebsocket: IChatWebsocket,
    @Inject(IMessageRepositoryToken) 
    private readonly messageRepository: IMessageRepository,
    @Inject(IUserRepositoryToken) 
    private readonly userRepository: IUserRepository,
    @Inject(IChatPublisherToken) 
    private readonly chatPublisher: IChatPublisher,
    @Inject(IChatServiceCacheToken)
    private readonly chatCache: IChatServiceCache,
    @Inject(IConversationRepositoryCacheToken)
    private readonly conversationRepositoryCache: IConversationRepositoryCache
  ) {}

  async handle(event: RemoveMemberEvent): Promise<void> {
    await this.updateCache(event);
    const savedMessage = await this.saveMessageAndNotify(event);
    
    await this.removeSocketClient(event.conversationId, event.removedUser);

    await this.chatPublisher.publishMessageCreated(new MessageCreatedIntegrationEvent(
      event.conversationId,
      savedMessage.content,
      savedMessage.createdAt
    ));
  }

  private async saveMessageAndNotify(event: RemoveMemberEvent){
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
    this.chatWebsocket.send(new MessageOutput(savedMessage, sender));
    return savedMessage;
  }

  private async removeSocketClient(conversationId: UUID, userId: UUID): Promise<void> {
    const socketIds = await this.chatCache.removeMemberAndGetSocketIds(conversationId, userId);
    if (socketIds.length > 0) {
      this.chatWebsocket.removeClientsFromConversation(socketIds, conversationId);
    }
  }

  private async updateCache(event: RemoveMemberEvent){
    await this.conversationRepositoryCache.removeMember(event.removedUser, event.conversationId);
  }
}