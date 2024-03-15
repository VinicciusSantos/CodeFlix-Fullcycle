import { InMemorySearchableRepository } from '@core/shared/infra/db/in-memory/in-memory.repository';
import { Uuid } from '@core/shared/domain/value-objects/uuid.vo';
import { ICategoryRepository } from '../../../domain/category.repository';
import { Category } from '../../../domain/category.entity';
import { SortDirection } from '@core/shared/domain/repository/search-params';

export class CategoryInMemoryRepository
  extends InMemorySearchableRepository<Category, Uuid>
  implements ICategoryRepository
{
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
}
