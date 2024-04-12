import { Entity } from '../../../domain/entity';
import { ValueObject } from '@core/shared/domain/value-objects';
import { NotFoundError } from '@core/shared/domain/errors';
import {
  SearchParams,
  SearchResult,
  SortDirection,
  IRepository,
  ISearchableRepository,
} from '@core/shared/domain/repository';

export abstract class InMemoryRepository<
  E extends Entity,
  EntityId extends ValueObject,
>
  implements IRepository<E, EntityId> {
  public items: E[] = [];

  public async insert(entity: E): Promise<void> {
    this.items.push(entity);
  }

  public async bulkInsert(entities: any[]): Promise<void> {
    this.items.push(...entities);
  }

  public async update(entity: E): Promise<void> {
    const indexFound = this.items.findIndex((item) =>
      item.entity_id.equals(entity.entity_id),
    );
    if (indexFound === -1) {
      throw new NotFoundError(entity.entity_id, this.getEntity());
    }
    this.items[indexFound] = entity;
  }

  public async delete(entity_id: EntityId): Promise<void> {
    const indexFound = this.items.findIndex((item) =>
      item.entity_id.equals(entity_id),
    );
    if (indexFound === -1) {
      throw new NotFoundError(entity_id, this.getEntity());
    }
    this.items.splice(indexFound, 1);
  }

  public async findById(entity_id: EntityId): Promise<E | null> {
    const item = this.items.find((item) => item.entity_id.equals(entity_id));
    return item ? item : null;
  }

  public async findAll(): Promise<any[]> {
    return this.items;
  }

  public abstract getEntity(): new (...args: any[]) => E;

  async existsById(ids: EntityId[]): Promise<{ exists: EntityId[]; not_exists: EntityId[] }> {
    const exists = [];
    const not_exists = [];
    for (const id of ids) {
      const item = this.items.find((item) => item.entity_id.equals(id));
      if (item) {
        exists.push(id);
      } else {
        not_exists.push(id);
      }
    }
    return {
      exists,
      not_exists,
    };
  }

  async findByIds(ids: EntityId[]): Promise<E[]> {
    return this.items.filter((item) => ids.some((id) => item.entity_id.equals(id)));
  }
}

export abstract class InMemorySearchableRepository<
  E extends Entity,
  EntityId extends ValueObject,
  Filter = string,
>
  extends InMemoryRepository<E, EntityId>
  implements ISearchableRepository<E, EntityId, Filter> {
  sortableFields: string[] = [];

  async search(props: SearchParams<Filter>): Promise<SearchResult<E>> {
    const itemsFiltered = await this.applyFilter(this.items, props.filter);
    const itemsSorted = this.applySort(
      itemsFiltered,
      props.sort,
      props.sort_dir,
    );
    const itemsPaginated = this.applyPaginate(
      itemsSorted,
      props.page,
      props.per_page,
    );
    return new SearchResult({
      items: itemsPaginated,
      total: itemsFiltered.length,
      current_page: props.page,
      per_page: props.per_page,
    });
  }

  protected abstract applyFilter(
    items: E[],
    filter: Filter | null,
  ): Promise<E[]>;

  protected applyPaginate(
    items: E[],
    page: SearchParams['page'],
    per_page: SearchParams['per_page'],
  ) {
    const start = (page - 1) * per_page; // 0 * 15 = 0
    const limit = start + per_page; // 0 + 15 = 15
    return items.slice(start, limit);
  }

  protected applySort(
    items: E[],
    sort: string | null,
    sort_dir: SortDirection | null,
    custom_getter?: (
      sort: string,
      item: E,
    ) => any,
  ) {
    if (!sort || !this.sortableFields.includes(sort)) {
      return items;
    }

    return [...items].sort((
      a,
      b,
    ) => {
      const aValue = custom_getter ? custom_getter(sort, a) : a[sort];
      const bValue = custom_getter ? custom_getter(sort, b) : b[sort];
      if (aValue < bValue) {
        return sort_dir === 'asc' ? -1 : 1;
      }

      if (aValue > bValue) {
        return sort_dir === 'asc' ? 1 : -1;
      }

      return 0;
    });
  }
}
