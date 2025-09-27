import { v4 as uuidv4 } from 'uuid';
export abstract class DomainEvent {
  public readonly eventId: string;
  public readonly occurredOn: Date;
  public readonly aggregateId: string;

  protected constructor(aggregateId: string, eventId?: string, occurredOn?: Date) {
    this.eventId = eventId || uuidv4();
    this.occurredOn = occurredOn || new Date();
    this.aggregateId = aggregateId;
  }

  abstract get eventName(): string;
}