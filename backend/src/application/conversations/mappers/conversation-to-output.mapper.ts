import { Inject, Injectable } from "@nestjs/common";
import { IMapper } from "src/application/abstraction/mapper.interface";
import { Conversation } from "src/domain/conversations/conversation";
import { ConversationOutput } from "../dtos/conversation.output";
import { IUserRepository, IUserRepositoryToken } from "src/domain/abstractions/repositories/user-repository.interface";

@Injectable()
export class ConversationToOutputMapper implements IMapper<Conversation, ConversationOutput>{
  constructor(
    @Inject(IUserRepositoryToken) private readonly userRepository: IUserRepository,
  ) {}

  async toObject(entity: Conversation): Promise<ConversationOutput> {
    const users = await this.userRepository.findByIds(entity.userInConversations.map(u => u.userId));
    const output = new ConversationOutput(
      entity.id,
      entity.title.value,
      entity.type,
      entity.theme,
      entity.avatar,
      users
    );
    return output;
  }
}