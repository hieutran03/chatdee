import { Inject, Injectable } from "@nestjs/common";
import { ConversationManagerService } from "src/domain/conversations/manager-service/conversation.manager-service";
import { CreateConversationInput } from "../dtos/create-conversation.input";
import { UUID } from "crypto";
import { Conversation } from "src/domain/conversations/conversation";
import { IConversationRepository, IConversationRepositoryToken } from "src/domain/abstractions/repositories/conversation-repository.interface";

@Injectable()
export class ConversationService{
  constructor(
    private conversationManagerService: ConversationManagerService,
    @Inject(IConversationRepositoryToken) private conversationRepository: IConversationRepository
  ){}

  async createConversation(creatorId: UUID,{ title, theme, avatar, targetUserIds }: CreateConversationInput){
    const allUserIds = await this.removeDuplicatedUserIds([creatorId, ...targetUserIds]);
    await this.conversationManagerService.validateConversationCreation(allUserIds);
    if(!title)
      title = await this.conversationManagerService.generateGroupChatConversationTitle(allUserIds);
    const conversation = Conversation.create(creatorId, allUserIds, title, theme, avatar);
    const savedConversation = await this.conversationRepository.save(conversation);
    return savedConversation; 
  }

  private async removeDuplicatedUserIds(userIds: UUID[]): Promise<UUID[]>{
    return Array.from(new Set(userIds));
  }
}