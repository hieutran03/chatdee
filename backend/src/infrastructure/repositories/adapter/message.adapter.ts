import { Message } from "src/domain/messages/message";
import { MessageOrm } from "src/infrastructure/relational-database/orm/message.orm";
import { IAdapter } from "src/shared/common/interfaces/adapter.interface";

export class MessageAdapter implements IAdapter<Message, MessageOrm>{
  toEntity(orm: MessageOrm): Message {
    return Message.assign(
      orm.id,
      orm.userId,
      orm.conversationId,
      orm.content,
      orm.type,
      orm.createdAt,
      orm.updatedAt
    );
  }

  toOrm(entity: Message): MessageOrm {
    return new MessageOrm({
      id: entity?.id,
      content: entity?.content,
      type: entity?.type,
      conversationId: entity?.conversationId,
      userId: entity?.userId,
      createdAt: entity?.createdAt,
      updatedAt: entity?.updatedAt
    });
  }
}