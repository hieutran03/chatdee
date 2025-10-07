import { AmqpConnection } from "@golevelup/nestjs-rabbitmq";
import { MessageCreatedIntegrationEvent } from "src/application/chats/integration-event/message-created.integration-event";
import { IChatPublisher } from "src/application/chats/publishers/chat-publisher.interface";

export class ChatPublisher implements IChatPublisher{
  constructor(
    private readonly amqpConnection: AmqpConnection
  ){}
  async publishMessageCreated(event: MessageCreatedIntegrationEvent): Promise<void> {
    await this.amqpConnection.publish('chat-exchange','message.created', event);
  }
}