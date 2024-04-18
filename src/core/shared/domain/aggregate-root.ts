import { Entity } from './entity';
import { IDomainEvent } from '@core/shared/domain/events/domain-event.interface';
import EventEmitter2 from 'eventemitter2';

export abstract class AggregateRoot extends Entity {
  public events: Set<IDomainEvent> = new Set<IDomainEvent>();
  public dispatchedEvents: Set<IDomainEvent> = new Set<IDomainEvent>();
  public localMediator = new EventEmitter2();

  public applyEvent(event: IDomainEvent): void {
    this.events.add(event);
    this.localMediator.emit(event.constructor.name, event);
  }

  public registerHandler(event: string, handler: (event: IDomainEvent) => void): void {
    this.localMediator.on(event, handler);
  }

  public markEventAsDispatched(event: IDomainEvent): void {
    this.dispatchedEvents.add(event);
  }

  public getUncommittedEvents(): IDomainEvent[] {
    return Array.from(this.events);
  }

 public clearEvents() {
    this.events.clear();
    this.dispatchedEvents.clear();
  }
}
