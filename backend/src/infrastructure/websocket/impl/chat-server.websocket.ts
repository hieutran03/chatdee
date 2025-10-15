import { Inject, Injectable } from "@nestjs/common";
import { UUID } from "crypto";
import { Server } from "socket.io";
import { IChatWebsocket } from "src/application/chats/websocket/chat-websocket.interface";
import { IConversationRepositoryCache, IConversationRepositoryCacheToken } from "src/application/conversations/cache/conversation-repository-cache.interface";
import { MessageOutput } from "src/application/messages/dtos/message.output";
import { ChatPatternUtil, ConversationPatternUtil } from "src/shared/core/utils/pattern.util";

@Injectable()
export class ChatServerWebsocket implements IChatWebsocket{
  constructor(
    @Inject(IConversationRepositoryCacheToken)
    private readonly conversationRepositoryCache: IConversationRepositoryCache
  ){}

  private server: Server = null;

  setServer(server: Server) {
    if(this.server) throw new Error('Server instance already set'); 
    this.server = server;
  }

  getServer(): Server {
    if(!this.server) throw new Error('Server instance not set');
    return this.server;
  }

  async send(message: MessageOutput){
    const conversation = ChatPatternUtil.getConversationPattern(message.conversationId);
    this.getServer().to(conversation).emit('chat', message);
    const members = await this.conversationRepositoryCache.findMembers(message.conversationId);
    console.log('Members: ', members);
    members.forEach(member => {
      if(member.userId !== message.sender.id){
        this.notifyInbox(member.userId, message);
      }
    });
  }

  notifyInbox(userId: UUID, message: MessageOutput) {
    const inboxPattern = ChatPatternUtil.getInBoxPattern(userId);
    console.log('Notify inbox to ', inboxPattern);
    this.getServer().to(inboxPattern).emit('inbox', message);
  }

  removeClientsFromConversation(socketIds: string[], conversationId: UUID) {
    socketIds.forEach(socketId => {
      const socket = this.getServer().sockets.sockets.get(socketId);
      if (socket) {
        socket.leave(ChatPatternUtil.getConversationPattern(conversationId));
      }
    });
  }
}