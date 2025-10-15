import { InjectRepository } from "@nestjs/typeorm";
import { UUID } from "crypto";
import { MessageCreatedIntegrationEvent } from "src/application/chats/integration-event/message-created.integration-event";
import { ConversationOrm } from "src/infrastructure/relational-database/orm/conversation.orm";
import { BaseBatchProcessor } from "src/shared/libs/batch-processor/base-batch.processor";
import { Repository } from "typeorm";

export const UpdateLastMessageProcessorToken = 'UpdateLastMessageProcessor';
export class UpdateLastMessageProcessor extends BaseBatchProcessor<MessageCreatedIntegrationEvent>{
  constructor(
    @InjectRepository(ConversationOrm)
    private readonly conversationRepository: Repository<ConversationOrm>
  ){
    super(100, 10000);
  }

  protected async processBatch(): Promise<void> {
    if(this.batch.length === 0) return;

    const currentBatch =  [...this.batch];
    this.batch = [];

    if(this.timer){
      clearTimeout(this.timer);
      this.timer = null;
    }

    const map = new Map<UUID, string>();

    for(const e of currentBatch){
      map.set(e.conversationId, e.lastMessage);
    }

    const batchArray = Array.from(map.entries()).map(
      ([converationId, lastMessage]) => ({
        conversationId: converationId,
        lastMessage,
      })
    );

    if (batchArray.length  === 0) return;

    await this.conversationRepository.manager.transaction(async (manager) => {
      const caseStatement = `
        CASE id
          ${batchArray
            .map(
              ({ conversationId, lastMessage }) =>
                `WHEN '${conversationId}' THEN '${lastMessage.replace(/'/g, "''")}'`
              )
            .join(' ')}
        END
      `;

      await manager
        .createQueryBuilder()
        .update(ConversationOrm)
        .set({ lastMessage: () => caseStatement })
        .whereInIds(batchArray.map(({ conversationId }) => conversationId))
        .execute();
    });
  }
}