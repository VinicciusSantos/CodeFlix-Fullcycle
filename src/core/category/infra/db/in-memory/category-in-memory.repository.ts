import { InMemorySearchableRepository } from '@core/shared/infra/db/in-memory/in-memory.repository';
import { Uuid } from '@core/shared/domain/value-objects/uuid.vo';
import { ICategoryRepository } from '../../../domain/category.repository';
import { Category } from '../../../domain/category.aggregate';
import { SortDirection } from '@core/shared/domain/repository/search-params';

export class CategoryInMemoryRepository
  extends InMemorySearchableRepository<Category, Uuid>
  implements ICategoryRepository {
  public sortableFields: string[] = ['name', 'created_at'];

  public getEntity(): new (...args: any[]) => Category {
    return Category;
  }

  protected async applyFilter(
    items: Category[],
    filter: string | null,
  ): Promise<Category[]> {
    if (!filter) {
      return items;
    }

    return items.filter(({ name }) =>
      name.toLowerCase().includes(filter.toLowerCase()),
    );
  }

  protected applySort(
    items: Category[],
    sort: string | null,
    sort_dir: SortDirection | null,
  ): Category[] {
    return sort
      ? super.applySort(items, sort, sort_dir)
      : super.applySort(items, 'created_at', 'desc');
  }

  async existsById(ids: Uuid[]): Promise<{ exists: Uuid[]; not_exists: Uuid[] }> {
    const exists = [];
    const not_exists = [];

    for (const id of ids) {
      const existsCategory = this.items.find((c: Category) => c.category_id.equals(id));
      if (existsCategory) {
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

  async findByIds(ids: Uuid[]): Promise<Category[]> {
    return this.items.filter((c: Category) => ids.some((id) => c.category_id.equals(id)));
  }
}
