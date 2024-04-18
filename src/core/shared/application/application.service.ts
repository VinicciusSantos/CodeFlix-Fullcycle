import { DomainEventMediator } from '../domain/events/domain-event-mediator';
import { IUnitOfWork } from '../domain/repository/unit-of-work.interface';

export class ApplicationService {
  constructor(
    private uow: IUnitOfWork,
    private domainEventMediator: DomainEventMediator,
  ) {}

  public async start(): Promise<void> {
    await this.uow.start();
  }

  public async finish(): Promise<void> {
    const aggregateRoots = [...this.uow.getAggregateRoots()];
    for (const aggregateRoot of aggregateRoots) {
      await this.domainEventMediator.publish(aggregateRoot);
    }
    await this.uow.commit();
  }

  public async fail() {
    await this.uow.rollback();
  }

  public async run<T>(callback: () => Promise<T>): Promise<T> {
    await this.start();
    try {
      const result = await callback();
      await this.finish();
      return result;
    } catch (error) {
      await this.fail();
      throw error;
    }
  }
}
