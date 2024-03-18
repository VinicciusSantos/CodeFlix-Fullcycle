import { ListCategoriesInput } from '@core/category/application/use-cases';
import { SortDirection } from '@core/shared/domain/repository';
import { CategoryFilter } from '@core/category/domain/category.repository';

export class SearchCategoriesDto implements ListCategoriesInput {
  public page: number;
  public per_page: number;
  public sort: string;
  public sort_dir: SortDirection;
  public filter: CategoryFilter;
}
