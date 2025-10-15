import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from '../../../application/chats/services/chat.service';
import { Inject, UseFilters, UseGuards, UsePipes } from '@nestjs/common';
import { WsJwtGuard } from 'src/application/auth/guards/ws-jwt.guard';
import { JoinChatInput } from '../../../application/chats/dtos/join-chat.input';
import { WsUser } from 'src/shared/core/decorators/ws-user.decorator';
import { SendMessageInput } from '../../../application/chats/dtos/send-message.input';
import { WsValidationPipe } from 'src/shared/core/pipes/ws-validation.pipe';
import { WebSocketExceptionFilter } from 'src/shared/core/filters/ws-exception.filter';
import { ChatServerWebsocket } from 'src/infrastructure/websocket/impl/chat-server.websocket';
import { IUserToSign } from 'src/application/auth/interfaces/user-to-sign.interface';
import { LeaveChatInput } from 'src/application/chats/dtos/leave-chat.input';
import { AppJwtService } from 'src/infrastructure/app-jwt/services/app-jwt.service';
import { ChatPatternUtil } from 'src/shared/core/utils/pattern.util';
import { IChatWebsocketToken } from 'src/application/chats/websocket/chat-websocket.interface';
import { IChatServiceCache, IChatServiceCacheToken } from 'src/application/chats/cache/chat-service-cache.interface';

@UsePipes(new WsValidationPipe())
@UseFilters(new WebSocketExceptionFilter())
@UseGuards(WsJwtGuard)
@WebSocketGateway(8080,{
  cors: {
    origin: '*', 
  },
})
export class ChatGateway{
  constructor(
    @Inject(IChatServiceCacheToken)
    private readonly chatCache: IChatServiceCache,
    private readonly chatService: ChatService,
    @Inject(IChatWebsocketToken)
    private readonly chatServer: ChatServerWebsocket,
    private readonly jwtService: AppJwtService
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
    await this.chatService.findConversationOrThrow(user.id, data.conversationId);
    const conversation = ChatPatternUtil.getConversationPattern(data.conversationId);
    client.join(conversation);
    this.chatCache.addSocketIdToMember(data.conversationId, user.id, client.id);
    this.server.to(conversation).emit('system', `${user.id} joined`);
  }

  @SubscribeMessage('chat')
  async handleChat(
    @MessageBody() data: SendMessageInput,
    @WsUser() user: IUserToSign
  ) {
    const message = await this.chatService.saveMessage(user, data);
    this.chatServer.send(message);
  }

  @SubscribeMessage('leave')
  async handleLeave(
    @MessageBody() data: LeaveChatInput,
    @ConnectedSocket() client: Socket,
  ) {
    const conversation = ChatPatternUtil.getConversationPattern(data.conversationId);
    client.leave(conversation);
    this.server.to(conversation).emit('system', `Socket client ${client.id} left`);
    this.chatCache.deleteSocketId(client.id);
  }

  async handleConnection(client: Socket) {
    const token = client.handshake.headers['authorization']?.split(' ')[1];
    if (!token){
      client.disconnect()
      return;
    }
    const verifiedData = await this.jwtService.verify(token);
    if (!verifiedData){
      client.disconnect();
      return;
    }
    console.log(`Client connected: ${client.id}, User ID: ${verifiedData.id}`);
    client.join(ChatPatternUtil.getInBoxPattern(verifiedData.id));
  }

  async handleDisconnect(client: Socket) {
    await this.chatCache.deleteSocketId(client.id);
    console.log(`Client disconnected: ${client.id}`);
  }
}
