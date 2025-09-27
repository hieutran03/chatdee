import { Inject } from "@nestjs/common";
import { EventsHandler } from "@nestjs/cqrs";
import { AddParticipantEvent } from "src/domain/conversations/events/add-participant.event";
import { IUserInConversationRepository, IUserInConversationRepositoryToken } from "src/domain/conversations/repositories/user-in-conversation-repository.interface";
import { Transactional } from "typeorm-transactional";

@EventsHandler(AddParticipantEvent)
export class AddParticipantHandler {
  constructor(
    @Inject(IUserInConversationRepositoryToken)
    private readonly userInConversationRepository: IUserInConversationRepository
  ) {}

  @Transactional()
  handle(event: AddParticipantEvent) {
    const { conversationId, userId } = event;
    return this.userInConversationRepository.addParticipant(conversationId, userId);
  }
}