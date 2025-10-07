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
import { JoinChatInput } from '../../../application/chats/dtos/join-chat.input';
import { WsUser } from 'src/shared/core/decorators/ws-user.decorator';
import { SendMessageInput } from '../../../application/chats/dtos/send-message.input';
import { WsValidationPipe } from 'src/shared/core/pipes/ws-validation.pipe';
import { WebSocketExceptionFilter } from 'src/shared/core/filters/ws-exception.filter';
import { ChatServerWebsocket } from 'src/infrastructure/websocket/impl/chat-server.websocket';
import { IUserToSign } from 'src/application/auth/interfaces/user-to-sign.interface';
import { LeaveChatInput } from 'src/application/chats/dtos/leave-chat.input';

@UsePipes(new WsValidationPipe())
@UseGuards(WsJwtGuard)
@UseFilters(new WebSocketExceptionFilter())
@WebSocketGateway(8080,{
  cors: {
    origin: '*', 
  },
})
export class ChatGateway{
  constructor(
    private readonly chatService: ChatService,
    private readonly chatServer: ChatServerWebsocket 
  ){}

  @WebSocketServer()
  server: Server;

  afterInit() {
    this.chatServer.setServer(this.server); 
  }

  @SubscribeMessage('join')
  async handleJoin(
    @MessageBody() data: JoinChatInput,
    @ConnectedSocket() client: Socket,
    @WsUser() user: IUserToSign
  ) {
    await this.chatService.findConversation(user.id, data.conversationId);
    client.join(data.conversationId);
    this.server.to(data.conversationId).emit('system', `${user.id} joined`);    
  }

  @SubscribeMessage('chat')
  async handleChat(
    @MessageBody() data: SendMessageInput,
    @WsUser() user: IUserToSign
  ) {
    const message = await this.chatService.saveMessage(user, data);
    this.server.to(data.conversationId).emit('chat', message);
  }

  @SubscribeMessage('leave')
  async handleLeave(
    @MessageBody() data: LeaveChatInput,
    @ConnectedSocket() client: Socket,
    @WsUser() user: IUserToSign
  ) {
    client.leave(data.conversationId);
    this.server.to(data.conversationId).emit('system', `${user.id} left`);
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }
}
