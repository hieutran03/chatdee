import { Inject, Injectable } from '@nestjs/common';
import { IChatNotifier } from 'src/application/chats/ports/chat-notifier.interface';
import { MessagePayload } from 'src/application/chats/payload/chat-message.type';
import { ChatServerWebsocket } from 'src/infrastructure/websocket/impl/chat-server.websocket';

@Injectable()
export class ChatNotifier implements IChatNotifier {
  constructor(
    private readonly chatServer: ChatServerWebsocket,

  ) {
  }
  async notify(message: MessagePayload): Promise<void> {
    this.chatServer.to(message.conversationId).emit('chat', message);
  }
}
