import { Inject } from "@nestjs/common";
import { UUID } from "crypto";
import { IConversationRepository, IConversationRepositoryToken } from "src/domain/conversations/repositories/conversation-repository.interface";
import { IUserRepository, IUserRepositoryToken } from "src/domain/users/repositories/user-repository.interface";
import { MinimumUsersInConversationException } from "src/shared/core/exceptions/conflict/minimum-users-in-conversation.exception";
import { DirectConversationAlreadyExistsException } from "src/shared/core/exceptions/conflict/direct-conversation-already-exist.exception";
import { DirectConversationNotFoundException } from "src/shared/core/exceptions/not-found/direction-not-found.exception";
import { AddInvalidUserToConversationException } from "src/shared/core/exceptions/bad-request/add-invallid-user-to-conversation.exception";
import { ConversationNotFoundException } from "src/shared/core/exceptions/not-found/conversation-not-found.exception";

export class ConversationDomainService {
  constructor(
    @Inject(IConversationRepositoryToken)
    private readonly conversationRepository: IConversationRepository,
    @Inject(IUserRepositoryToken)
    private readonly userRepository: IUserRepository
  ) {}
  
  async validateConversation(allUserIds: UUID[]) {
    if (allUserIds.length < 2)
      throw new MinimumUsersInConversationException();

    if(allUserIds.length === 2)
      await this.validateDirectConversationNotExist(allUserIds[0], allUserIds[1]);
    return await this.validateUsersExist(allUserIds);
  }

  async ensureDirectConversationExists(firstUserId: UUID, secondUserId: UUID): Promise<UUID> {
    const existingConversation = await this.conversationRepository.findDirectConversation(firstUserId, secondUserId);
    if (!existingConversation) 
      throw new DirectConversationNotFoundException(firstUserId, secondUserId);
    return existingConversation.id;
  }

  async addMemberToConversation(addedById: UUID,conversationId: UUID, userId: UUID) {
    await this.validateUsersExist([userId]);
    const conversation = await this.conversationRepository.findById(conversationId);
    if (!conversation) 
      throw new ConversationNotFoundException(conversationId);
    conversation.addMember(addedById, userId);
    await this.conversationRepository.save(conversation);
    return conversation;
  }
  
  private async validateUsersExist(userIds: UUID[]) {
    const users = await this.userRepository.findByIds(userIds);
    const foundUserIds = new Set(users.map(user => user.id));
    const errors = []
    userIds.forEach((id)=>{
      if(!foundUserIds.has(id)){
        errors.push(`User with id ${id} does not exist`);
      }
    })
    if(errors.length > 0){
      throw new AddInvalidUserToConversationException(errors);
    }
  }

  private async validateDirectConversationNotExist(firstUserId: UUID, secondUserId: UUID) {
    const conversation = await this.conversationRepository.findDirectConversation(firstUserId, secondUserId);
    if (conversation) throw new DirectConversationAlreadyExistsException(firstUserId, secondUserId);
  }
}