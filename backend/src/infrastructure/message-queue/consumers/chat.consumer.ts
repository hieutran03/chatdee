import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Inject, Injectable } from '@nestjs/common';
import { MessageCreatedIntegrationEvent } from 'src/application/chats/integration-event/message-created.integration-event';
import { UpdateLastMessageProcessorToken } from 'src/infrastructure/repositories/processors/update-last-message.processor';
import { RabbitMQExchangeEnum } from 'src/shared/common/enums/rabbitmq-exchange.enum';
import { RabbitMQRoutingKeyEnum } from 'src/shared/common/enums/rabbitmq-routing-key.enum';
import { IBatchProcessor } from 'src/shared/libs/batch-processor/batch-processor.interface';

@Injectable()
export class ChatConsumer {


  constructor(
    @Inject(UpdateLastMessageProcessorToken)
    private readonly updateLastMessageProcessor: IBatchProcessor<MessageCreatedIntegrationEvent>,
  ) {}

  @RabbitSubscribe({
    exchange: RabbitMQExchangeEnum.CHAT_EXCHANGE,
    routingKey: RabbitMQRoutingKeyEnum.MESSAGE_CREATED,
    queue: process.env.QUEUE_CHAT,
  })
  async handleUpdateLastMessage(msg: MessageCreatedIntegrationEvent) {
    this.updateLastMessageProcessor.push(msg);
  }

  
}
