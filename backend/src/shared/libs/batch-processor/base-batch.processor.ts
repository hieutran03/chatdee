import { IBatchProcessor } from "./batch-processor.interface";

export abstract class BaseBatchProcessor<T> implements IBatchProcessor<T> {
  protected batch: T[] = [];
  protected timer: NodeJS.Timeout | null = null;
  protected batchInterval: number = 10000;
  protected batchSize: number = 100;

  protected abstract processBatch(): Promise<void>;

  constructor(batchSize?: number, batchInterval?: number) {
    if (batchInterval) {
      this.batchInterval = batchInterval;
    }
    if (batchSize) {
      this.batchSize = batchSize;
    }
  }

  async push(item: T): Promise<void> {
    this.batch.push(item);
    if (this.batch.length >= this.batchSize) {
      await this.flush();
    } else if (!this.timer) {
      this.timer = setTimeout(() => this.flush(), this.batchInterval);
    }
  }

  private async flush(): Promise<void> {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    if (this.batch.length === 0) {
      return;
    }

    await this.processBatch();
    this.batch = [];
  }
}