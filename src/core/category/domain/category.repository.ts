import { Category, CategoryId } from './category.aggregate';
import { ISearchableRepository, SearchParams, SearchResult } from '@core/shared/domain/repository';

export type CategoryFilter = string;

export class CategorySearchParams extends SearchParams<CategoryFilter> {}

export class CategorySearchResult extends SearchResult<Category> {}

export interface ICategoryRepository
  extends ISearchableRepository<
    Category,
    CategoryId,
    CategoryFilter,
    CategorySearchParams,
    CategorySearchResult
  > {}
