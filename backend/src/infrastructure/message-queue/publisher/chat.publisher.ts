import { AmqpConnection } from "@golevelup/nestjs-rabbitmq";
import { Injectable } from "@nestjs/common";
import { MessageCreatedIntegrationEvent } from "src/application/chats/integration-event/message-created.integration-event";
import { IChatPublisher } from "src/application/chats/publishers/chat-publisher.interface";
import { RabbitMQExchangeEnum } from "src/shared/common/enums/rabbitmq-exchange.enum";
import { RabbitMQRoutingKeyEnum } from "src/shared/common/enums/rabbitmq-routing-key.enum";

@Injectable()
export class ChatPublisher implements IChatPublisher{
  constructor(
    private readonly amqpConnection: AmqpConnection
  ){}
  async publishMessageCreated(event: MessageCreatedIntegrationEvent): Promise<void> {
    try {
      await this.amqpConnection.publish(RabbitMQExchangeEnum.CHAT_EXCHANGE,RabbitMQRoutingKeyEnum.MESSAGE_CREATED, event);
    } catch (error) {
      console.error("Error publishing message created event:", error);
    }
  }
}