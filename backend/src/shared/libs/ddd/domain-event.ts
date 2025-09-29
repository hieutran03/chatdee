import { v4 as uuidv4 } from 'uuid';
export class DomainEvent {
  public readonly eventId: string;
  public readonly occurredOn: Date;
  public readonly aggregateId: string;
  public readonly eventName: string;

  protected constructor(aggregateId: string, eventName: string, eventId?: string, occurredOn?: Date) {
    this.eventId = eventId || uuidv4();
    this.occurredOn = occurredOn || new Date();
    this.aggregateId = aggregateId;
    this.eventName = eventName;
  }

  getAggregateId(): string {
    return this.aggregateId;
  }

  getEventId(): string {
    return this.eventId;
  }

  getOccurredOn(): Date {
    return this.occurredOn;
  }
}