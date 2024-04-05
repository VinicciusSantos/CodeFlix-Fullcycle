import {
  ISearchableRepository,
  SearchParams,
  SearchParamsConstructorProps,
  SearchResult,
} from '@core/shared/domain/repository';
import {
  Genre,
  GenreId,
} from '@core/genre/domain/genre.aggregate';
import { CategoryId } from '@core/category/domain/category.aggregate';

export interface GenreFilter {
  name?: string;
  categories_id?: CategoryId[] | string[];
}

export class GenreSearchParams extends SearchParams<GenreFilter> {
  protected get filter(): GenreFilter | null {
    return this._filter;
  }

  protected set filter(value: GenreFilter | null) {
    const _value =
      value && (value as unknown) !== '' && typeof value === 'object'
        ? value
        : null;
    const filter = {
      ...(_value?.name && { name: `${ _value.name }` }),
      ...(_value?.categories_id?.length && { categories_id: _value.categories_id }),
    };

    this._filter = Object.keys(filter).length ? filter : null;
  }

  private constructor(props: SearchParamsConstructorProps<GenreFilter> = {}) {
    super(props);
  }

  static create(props: SearchParamsConstructorProps<GenreFilter> = {}) {
    const categories_id = props.filter?.categories_id?.map((c) =>
      c instanceof CategoryId ? c : new CategoryId(c),
    );
    return new GenreSearchParams({
      ...props,
      filter: {
        ...props.filter,
        categories_id,
      },
    });
  }
}

export class GenreSearchResult extends SearchResult<Genre> {
}

export interface IGenreRepository
  extends ISearchableRepository<
    Genre,
    GenreId,
    GenreFilter,
    GenreSearchParams,
    GenreSearchResult
  > {
}
