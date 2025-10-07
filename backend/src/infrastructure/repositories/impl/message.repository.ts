import { Message } from "src/domain/messages/message";
import { IMessageRepository } from "src/domain/messages/repositories/message-repository.interface";
import { MessageAdapter } from "../adapter/message.adapter";
import { IAdapter } from "src/shared/common/interfaces/adapter.interface";
import { MessageOrm } from "src/infrastructure/relational-database/orm/message.orm";
import { Inject } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UUID } from "crypto";
import { MessagePaginationContract } from "src/domain/messages/contracts/message-pagination.contract";
import { Direction } from "src/shared/common/enums/direction.enum";
import { TCursor } from "src/shared/common/types/cursor.type";
import { cursorPaginate } from "src/shared/core/utils/cursor-pagination.util";
import { MessageDetailContract } from "src/domain/messages/contracts/message-detail.contract";
import { UserAdapter } from "../adapter/user.adapter";
import { UserOrm } from "src/infrastructure/relational-database/orm/user.orm";
import { User } from "src/domain/users/users";


export class MessageRepository implements IMessageRepository{
  constructor(
    @Inject(MessageAdapter)
    private readonly messageAdapter: IAdapter<Message, MessageOrm>,

    @InjectRepository(MessageOrm)
    private readonly messageRepository: Repository<MessageOrm>,

    @Inject(UserAdapter)
    private readonly userAdapter: IAdapter<User, UserOrm>
  ){}

  async findWithCursorPagination(conversationId: UUID, limit: number, cursor: TCursor, direction: Direction = Direction.PREV): Promise<MessagePaginationContract> {
    const qb = this.messageRepository.createQueryBuilder('message')
      .where('message.conversationId = :conversationId', { conversationId })
      .leftJoinAndSelect('message.user', 'user')

    const result = await cursorPaginate(qb, limit, cursor, qb.alias, 'createdAt', direction);
    const messageDetails = result.data.map(item => new MessageDetailContract(
      this.messageAdapter.toEntity(item), 
      this.userAdapter.toEntity(item.user)
    ));

    return {
      messages: messageDetails,
      limit,
      nextCursor: result.nextCursor,
      previousCursor: result.previousCursor
    };
  }

  async save(message: Message): Promise<Message>{
    const messageOrm = this.messageAdapter.toOrm(message);
    const savedMessage = await this.messageRepository.save(messageOrm);
    return this.messageAdapter.toEntity(savedMessage);
  }

  async findById(id: UUID): Promise<Message> {
    const messageOrm = await this.messageRepository.findOneBy({ id });
    if(!messageOrm) return null;
    return this.messageAdapter.toEntity(messageOrm);
  }

  async delete(id: UUID): Promise<void> {
    await this.messageRepository.delete({ id });
  }
}