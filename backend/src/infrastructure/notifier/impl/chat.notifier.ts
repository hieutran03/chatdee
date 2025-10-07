import { Inject, Injectable } from '@nestjs/common';
import { IChatNotifier } from 'src/application/chats/notifiers/chat-notifier.interface';
import { ChatServerWebsocket } from 'src/infrastructure/websocket/impl/chat-server.websocket';
import { MessageOutput } from 'src/application/messages/dtos/message.output';

@Injectable()
export class ChatNotifier implements IChatNotifier {
  constructor(
    private readonly chatServer: ChatServerWebsocket,

  ) {
  }
  async notify(message: MessageOutput): Promise<void> {
    this.chatServer.to(message.conversationId).emit('chat', message);
  }
}
