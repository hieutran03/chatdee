import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import { AddParticipantPayload } from 'src/application/chats/payload/add-participant.payload';
import { RemoveParticipantPayload } from 'src/application/chats/payload/remove-participant.payload';
import { IChatNotifier } from 'src/application/chats/ports/chat-notifier.interface';
import { MessageTypeEnum } from 'src/infrastructure/relational-database/orm/message.orm';
import { ChatServerWebsocket } from 'src/infrastructure/websocket/impl/chat-server.websocket';
import { ChatActionEnum } from 'src/shared/common/enums/chat-action.enum';

@Injectable()
export class ChatNotifier implements IChatNotifier {
  get server(): Server {
    return this.chatServer.getServer();
  }
  constructor(private readonly chatServer: ChatServerWebsocket) {
  }
  addParticipant({conversationId, addedBy, addedUser}: AddParticipantPayload) {
    this.server.to(conversationId).emit('chat', {
      userId: addedBy,
      type: MessageTypeEnum.NOTIFICATION,
      content: addedUser,
      action: ChatActionEnum.ADD_PARTICIPANT,
    });
  }

  removeParticipant({conversationId, removedBy, removedUser}: RemoveParticipantPayload) {
    this.server.to(conversationId).emit('chat', {
      userId: removedBy,
      type: MessageTypeEnum.NOTIFICATION,
      content: removedUser,
      action: ChatActionEnum.REMOVE_PARTICIPANT,
    });
  }
}
