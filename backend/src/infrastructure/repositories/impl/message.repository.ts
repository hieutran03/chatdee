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


export class MessageRepository implements IMessageRepository{
  constructor(
    @Inject(MessageAdapter)
    private readonly messageAdapter: IAdapter<Message, MessageOrm>,

    @InjectRepository(MessageOrm)
    private readonly messageRepository: Repository<MessageOrm>
  ){}

  async findWithCursorPagination(conversationId: UUID, limit: number, cursor: TCursor, direction?: Direction): Promise<MessagePaginationContract> {
    const qb = this.messageRepository.createQueryBuilder('message')
      .where('message.conversationId = :conversationId', { conversationId })

    const result = await cursorPaginate(qb, limit, cursor, 'createdAt', direction);

    const messages = result.data.map(item => this.messageAdapter.toEntity(item));

    return {
      messages,
      limit,
      nextCursor: result.nextCursor,
      previousCursor: result.previousCursor
    };
  }

  async save(message: Message): Promise<void>{
    const messageOrm = this.messageAdapter.toOrm(message);
    await this.messageRepository.save(messageOrm);
  }

  async findById(id: UUID): Promise<Message> {
    const messageOrm = await this.messageRepository.findOneBy({ id });
    return this.messageAdapter.toEntity(messageOrm);
  }
}