import { RabbitSubscribe } from "@golevelup/nestjs-rabbitmq";
import { Injectable } from "@nestjs/common";
import { UUID } from "crypto";
import { MessageCreatedIntegrationEvent } from "src/application/chats/integration-event/message-created.integration-event";
import { DataSource } from "typeorm";

@Injectable()
export class ChatConsumer {
  private batch: MessageCreatedIntegrationEvent[] = [];
  private timer: NodeJS.Timeout | null = null;
  private readonly batchInterval = 2000; // gom mỗi 2 giây
  private readonly batchSize = 100; 

  constructor(private readonly dataSource: DataSource) {}

  @RabbitSubscribe({
    exchange: 'chat_exchange',
    routingKey: 'message.created',
    queue: 'chat_service_queue',
  })
  async handleMessage(msg: MessageCreatedIntegrationEvent) {
    this.batch.push(msg);
    if (this.batch.length >= this.batchSize) {
      await this.flushBatch();
    } else if (!this.timer) {
      this.timer = setTimeout(() => this.flushBatch(), this.batchInterval);
    }
  }

  private async flushBatch() {
    if (this.batch.length === 0) return;
    const currentBatch = [...this.batch];
    this.batch = [];
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    const map = new Map<UUID, string>();
    for (const e of currentBatch) map.set(e.conversationId, e.lastMessage);

    const batchArray = Array.from(map.entries()).map(([conversationId, lastMessage]) => ({
      conversationId,
      lastMessage ,
    }));

    // bulk update
    const query = `
      UPDATE conversation c
      SET "last_message" = CASE id
        ${batchArray
          .map(
            ({ conversationId, lastMessage }) =>
              `WHEN '${conversationId}' THEN '${lastMessage}'`
          )
          .join(' ')}
      END
      WHERE id IN (${batchArray.map(b => `'${b.conversationId}'`).join(', ')});
    `;

    await this.dataSource.query(query);
  }
}