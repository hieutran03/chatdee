import { Inject, Injectable } from '@nestjs/common';
import { IChatNotifier } from 'src/application/chats/ports/chat-notifier.interface';
import { MessagePayload } from 'src/application/chats/payload/chat-message.type';
import { IMessageRepository, IMessageRepositoryToken } from 'src/domain/messages/repositories/message-repository.interface';
import { ChatServerWebsocket } from 'src/infrastructure/websocket/impl/chat-server.websocket';

@Injectable()
export class ChatNotifier implements IChatNotifier {
  constructor(
    private readonly chatServer: ChatServerWebsocket,
    @Inject(IMessageRepositoryToken)
    private readonly messageRepository: IMessageRepository
  ) {
  }
  async notify(message: MessagePayload): Promise<void> {
    const entity = message.toEntity();
    await this.messageRepository.save(entity);
    this.chatServer.to(message.conversationId).emit('chat', message);
  }
}
