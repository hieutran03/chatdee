import { Inject } from "@nestjs/common";
import { IUserInConversationRepository } from "src/domain/conversations/repositories/user-in-conversation-repository.interface";
import { UserInConversation } from "src/domain/conversations/entities/user-in-conversation.entity";
import { UserInConversationAdapter } from "../adapter/user-in-conversation.adapter";
import { IAdapter } from "src/shared/common/interfaces/adapter.interface";
import { UserInConversationOrm } from "src/infrastructure/relational-database/orm/user-in-conversation.orm";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UUID } from "crypto";

export class UserInConversationRepository implements IUserInConversationRepository{
  constructor(
    @Inject(UserInConversationAdapter)
    private readonly userInConversationAdapter: IAdapter<UserInConversation, UserInConversationOrm>,
    @InjectRepository(UserInConversationOrm)
    private readonly userInConversationRepository: Repository<UserInConversationOrm>,
  ){}
  async findParticipant(userId: UUID, conversationId: UUID): Promise<UserInConversation> {
    const userInConversationOrm = await this.userInConversationRepository.findOne({
      where: { userId, conversationId },
    });
    return userInConversationOrm ? this.userInConversationAdapter.toEntity(userInConversationOrm) : null;
  }
  
  async findUserInConversations( conversationId: UUID): Promise<UserInConversation[]> {
    const userInConversationOrms = await this.userInConversationRepository.find({
      where: { conversationId },
    });
    return userInConversationOrms.map(orm => this.userInConversationAdapter.toEntity(orm));
  }
  async findAllConversationsOfUser(userId: UUID): Promise<UserInConversation[]> {
    const userInConversationOrms = await this.userInConversationRepository.find({
      where: { userId },
    });
    return userInConversationOrms.map(orm => this.userInConversationAdapter.toEntity(orm));
  }
}