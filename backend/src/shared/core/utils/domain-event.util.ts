import { EventBus } from "@nestjs/cqrs";
import { Aggregate } from "src/shared/libs/ddd/aggregate";

export function publishDomainEvents<T>(eventBus: EventBus, aggregate: Aggregate<T>){
  const events = aggregate.pullDomainEvents();
  events.map(event => eventBus.publish(event));
}