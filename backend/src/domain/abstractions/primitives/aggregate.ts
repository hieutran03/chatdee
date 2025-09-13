import { AggregateRoot } from "@nestjs/cqrs";

export class Aggregate<T> extends AggregateRoot{
  _id: T;
  private domainEvents: any[];
  constructor(id: T) {
    super();
    this.domainEvents = [];
    this.setId(id);
  }

  get id(): T {
    return this._id;
  }

  setId(id: T) {
    this._id = id;
  }
  
  addDomainEvent(event: any) {
    this.domainEvents.push(event);
  }

  pullDomainEvents(): any[] {
    const events = this.domainEvents;
    this.domainEvents = [];
    return events;
  }
}