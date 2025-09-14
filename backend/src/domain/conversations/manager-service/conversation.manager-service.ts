import { Inject } from "@nestjs/common";
import { UUID } from "crypto";
import { IConversationRepository, IConversationRepositoryToken } from "src/domain/abstractions/repositories/conversation-repository.interface";
import { IUserRepository, IUserRepositoryToken } from "src/domain/abstractions/repositories/user-repository.interface";
import { ConversationAlreadyExistException } from "src/shared/core/exceptions/conversation-already-exist.exception";
import { ConversationNotFoundException } from "src/shared/core/exceptions/conversation-not-found.exception";
import { MinimumUserInConversationConflictException } from "src/shared/core/exceptions/minimum-user-in-conversation-conflict.exception";

export class ConversationManagerService {
  constructor(
    @Inject(IConversationRepositoryToken)
    private readonly conversationRepository: IConversationRepository,
    @Inject(IUserRepositoryToken)
    private readonly userRepository: IUserRepository
  ) {}
  
  async validateConversationCreation(allParticipantIds: UUID[]) {
    if (allParticipantIds.length < 2)
      throw new MinimumUserInConversationConflictException();

    if(allParticipantIds.length === 2)
      await this.validateDirectConversationNotExist(allParticipantIds[0], allParticipantIds[1]);

    return await this.validateUsersExist(allParticipantIds);
  }

  async generateGroupChatConversationTitle(allParticipantIds: UUID[]): Promise<string> {
    const users = await this.userRepository.findByIds(allParticipantIds);
    const usernameMap = new Map<string, string>();
    users.forEach(user => usernameMap.set(user.id, user.name));
    return this.formatGroupName(usernameMap);
  }

  async ensureDirectConversationExists(firstUserId: UUID, secondUserId: UUID): Promise<UUID> {
    const existingConversation = await this.conversationRepository.findDirectConversation(firstUserId, secondUserId);
    if (!existingConversation) 
      throw new ConversationNotFoundException(firstUserId, secondUserId);
    return existingConversation.id;
  }

  private formatGroupName(usernameMap: Map<string, string>, maxLength: number = 100): string {
    const usernames = Array.from(usernameMap.values());
    
    if (usernames.length === 0) return 'Group Chat';

    if (usernames.length === 1) return `Chat with ${usernames[0]}`;

    // Format: "User1, User2, User3 and X more"
    const displayNames = usernames.slice(0, 3);
    const remainingCount = usernames.length - displayNames.length;

    let name = displayNames.join(', ');
    
    if (remainingCount > 0) name += ` and ${remainingCount} more`;

    // Ensure it doesn't exceed max length
    if (name.length > maxLength) name = this.truncateName(name, maxLength, usernames.length);

    return name;
  }

  private truncateName(name: string, maxLength: number, totalParticipants: number): string {
    if (name.length <= maxLength) return name;

    // Fallback 1: Remove "and X more" and show count
    const simpleName = `Group with ${totalParticipants} people`;
    if (simpleName.length <= maxLength) return simpleName;

    // Fallback 2: Just show count
    return `${totalParticipants} people group`;
  }


  private async validateUsersExist(userIds: UUID[]) {
    const users = await this.userRepository.findByIds(userIds);
    const foundUserIds = new Set(users.map(user => user.id));
    const notFoundUserIds = userIds.filter(id => !foundUserIds.has(id));
    if (notFoundUserIds.length > 0) {
    }
    
  }

  private async validateDirectConversationNotExist(firstUserId: UUID, secondUserId: UUID) {
    const conversation = await this.conversationRepository.findDirectConversation(firstUserId, secondUserId);
    if (conversation) throw new ConversationAlreadyExistException(firstUserId, secondUserId, conversation.id);
  }
}