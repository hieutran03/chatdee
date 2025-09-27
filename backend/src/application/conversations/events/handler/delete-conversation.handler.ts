import { Inject } from "@nestjs/common";
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { DeleteConversationEvent } from "src/domain/conversations/events/delete-conversation.event";
import { IConversationRepository, IConversationRepositoryToken } from "src/domain/conversations/repositories/conversation-repository.interface";
import { IUserInConversationRepository, IUserInConversationRepositoryToken } from "src/domain/conversations/repositories/user-in-conversation-repository.interface";

@EventsHandler(DeleteConversationEvent)
export class DeleteConversationHandler implements IEventHandler<DeleteConversationEvent>{
  constructor(
    @Inject(IUserInConversationRepositoryToken)
    private readonly userInConversationRepository: IUserInConversationRepository,
    @Inject(IConversationRepositoryToken)
    private readonly conversationRepository: IConversationRepository
  ) {}
  async handle({ conversationId }: DeleteConversationEvent) {
    await this.userInConversationRepository.removeAllParticipants(conversationId);
    await this.conversationRepository.delete(conversationId)
  }
}