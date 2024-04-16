import { ValueObject } from '@core/shared/domain/value-objects';

export interface IDomainEvent {
  aggregate_id: ValueObject;
  occurred_on: Date;
  event_version: number;
}
