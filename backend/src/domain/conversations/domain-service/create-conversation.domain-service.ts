import { Inject } from "@nestjs/common";
import { UUID } from "crypto";
import { IConversationRepository, IConversationRepositoryToken } from "src/domain/conversations/repositories/conversation-repository.interface";
import { IUserRepository, IUserRepositoryToken } from "src/domain/users/repositories/user-repository.interface";
import { MinimumUsersInConversationException } from "src/shared/core/exceptions/bussiness/minimum-users-in-conversation.exception";
import { DirectConversationAlreadyExistsException } from "src/shared/core/exceptions/conflict/direct-conversation-already-exist.exception";
import { DirectConversationNotFoundException } from "src/shared/core/exceptions/not-found/direction-not-found.exception";

export class CreateConversationDomainService {
  constructor(
    @Inject(IConversationRepositoryToken)
    private readonly conversationRepository: IConversationRepository,
    @Inject(IUserRepositoryToken)
    private readonly userRepository: IUserRepository
  ) {}
  
  async validateConversation(allParticipantIds: UUID[]) {
    if (allParticipantIds.length < 2)
      throw new MinimumUsersInConversationException();

    if(allParticipantIds.length === 2)
      await this.validateDirectConversationNotExist(allParticipantIds[0], allParticipantIds[1]);
    return await this.validateUsersExist(allParticipantIds);
  }

  async ensureDirectConversationExists(firstUserId: UUID, secondUserId: UUID): Promise<UUID> {
    const existingConversation = await this.conversationRepository.findDirectConversation(firstUserId, secondUserId);
    if (!existingConversation) 
      throw new DirectConversationNotFoundException(firstUserId, secondUserId);
    return existingConversation.id;
  }
  
  private async validateUsersExist(userIds: UUID[]) {
    const users = await this.userRepository.findByIds(userIds);
    const foundUserIds = new Set(users.map(user => user.id));
    const notFoundUserIds = userIds.filter(id => !foundUserIds.has(id));
    if (notFoundUserIds.length > 0) {//-> Throw exception
    }
  }

  private async validateDirectConversationNotExist(firstUserId: UUID, secondUserId: UUID) {
    const conversation = await this.conversationRepository.findDirectConversation(firstUserId, secondUserId);
    if (conversation) throw new DirectConversationAlreadyExistsException(firstUserId, secondUserId);
  }
}