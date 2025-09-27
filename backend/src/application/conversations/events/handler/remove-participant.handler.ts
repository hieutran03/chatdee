import { Inject } from "@nestjs/common";
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { RemoveParticipantEvent } from "src/domain/conversations/events/remove-participant.event";
import { IUserInConversationRepository, IUserInConversationRepositoryToken } from "src/domain/conversations/repositories/user-in-conversation-repository.interface";
import { Transactional } from "typeorm-transactional";

@EventsHandler(RemoveParticipantEvent)
export class RemoveParticipantHandler implements IEventHandler<RemoveParticipantEvent>{
  constructor(
    @Inject(IUserInConversationRepositoryToken)
    private readonly userInConversationRepository: IUserInConversationRepository
  ){}
  
  @Transactional()
  handle(event: RemoveParticipantEvent) {
    const { conversationId, userId } = event;
    return this.userInConversationRepository.removeParticipant(conversationId, userId);
  }
}