import EventEmitter2 from 'eventemitter2';
import { AggregateRoot } from '../aggregate-root';

export class DomainEventMediator {
  constructor(private eventEmitter: EventEmitter2) {
  }

  public register(
    event: string,
    handler: (values: any) => void,
  ) {
    this.eventEmitter.on(event, handler);
  }

  public async publish(aggregateRoot: AggregateRoot) {
    for (const event of aggregateRoot.getUncommittedEvents()) {
      const eventClassName = event.constructor.name;
      await this.eventEmitter.emitAsync(eventClassName, event);
    }
  }
}
