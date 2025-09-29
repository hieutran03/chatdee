import { AggregateRoot } from "@nestjs/cqrs";
import { DomainEvent } from "./domain-event";

export class Aggregate<T> extends AggregateRoot{
  private _id: T;
  private domainEvents: DomainEvent[];
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
  
  addDomainEvent(event: DomainEvent) {
    this.domainEvents.push(event);
  }

  pullDomainEvents(): DomainEvent[] {
    const events = this.domainEvents;
    this.domainEvents = [];
    return events;
  }
}