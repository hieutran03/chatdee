import { Module } from '@nestjs/common';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { RabbitMQExchangeEnum } from 'src/shared/common/enums/rabbitmq-exchange.enum';
import { consumers } from './consumers';
import { publishers } from './publisher';

@Module({
  imports: [
    RabbitMQModule.forRoot({
      exchanges: [{ name: RabbitMQExchangeEnum.CHAT_EXCHANGE, type: 'topic' }],
      uri: `amqp://${process.env.RABBITMQ_DEFAULT_USER}:${process.env.RABBITMQ_DEFAULT_PASS}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`,
      connectionInitOptions: { wait: true },
    }),
  ],
  providers: [
    ...consumers,
    ...publishers
  ],
  exports: [
    ...publishers
  ]
})
export class MessageQueueModule {}