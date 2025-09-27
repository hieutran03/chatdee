import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from '../../../application/chats/services/chat.service';
import { UseFilters, UseGuards, UsePipes } from '@nestjs/common';
import { WsJwtGuard } from 'src/application/auth/guards/ws-jwt.guard';
import { JoinConversationInput } from '../../../application/chats/dtos/join-conversation.input';
import { WsUser } from 'src/shared/core/decorators/ws-user.decorator';
import { SendMessageInput } from '../../../application/chats/dtos/send-message.input';
import { User } from 'src/domain/users/users';
import { WsValidationPipe } from 'src/shared/core/pipes/ws-validation.pipe';
import { WebSocketExceptionFilter } from 'src/shared/core/filters/ws-exception.filter';
import { EventBus } from '@nestjs/cqrs';

@UsePipes(new WsValidationPipe())
@UseGuards(WsJwtGuard)
@UseFilters(new WebSocketExceptionFilter())
@WebSocketGateway(8080,{
  cors: {
    origin: '*', 
  },
})
export class ChatGateway {
  constructor(
    private readonly chatService: ChatService,
    private readonly eventBus: EventBus
  ){}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('join')
  async handleJoin(
    @MessageBody() data: JoinConversationInput,
    @ConnectedSocket() client: Socket,
    @WsUser() user: User
  ) {
    await this.chatService.findConversation(data.conversationId);
    client.join(data.conversationId);
    this.server.to(data.conversationId).emit('system', `${user.id} joined`);    
  }

  @SubscribeMessage('chat')
  async handleChat(
    @MessageBody() data: SendMessageInput,
    @WsUser() user: User
  ) {
    await this.chatService.saveMessage(user.id, data);
    this.server.to(data.conversationId).emit('chat', {
      userId: user.id,
      content: data.content,
    });
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }
}
