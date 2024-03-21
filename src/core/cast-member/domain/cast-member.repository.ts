import { Either } from '../../shared/domain/either';
import {
  SearchParams as DefaultSearchParams,
  SearchParamsConstructorProps,
  SearchResult as DefaultSearchResult,
  ISearchableRepository,
} from '../../shared/domain/repository';
import { SearchValidationError } from '@core/shared/domain/validators';
import {
  CastMemberType,
  CastMemberTypes,
  InvalidCastMemberTypeError,
} from './cast-member-type.vo';
import {
  CastMember,
  CastMemberId,
} from './cast-member.aggregate';

export type CastMemberFilter<Type = CastMemberType> = {
  name?: string;
  type?: Type;
};

export class CastMemberSearchParams extends DefaultSearchParams<CastMemberFilter> {
  private constructor(
    props: SearchParamsConstructorProps<CastMemberFilter> = {},
  ) {
    super(props);
  }

  static create(props: SearchParamsConstructorProps<CastMemberFilter<CastMemberTypes>> = {}) {
    const [type, errorCastMemberType] = Either.of(props.filter?.type)
      .map((type) => type || null)
      .chain<CastMemberType | null, InvalidCastMemberTypeError>((type) =>
        type ? CastMemberType.create(type) : Either.of(null),
      )
      .asArray();

    if (errorCastMemberType) {
      throw new SearchValidationError([
        { type: [errorCastMemberType.message] },
      ]);
    }

    return new CastMemberSearchParams({
      ...props,
      filter: {
        name: props.filter?.name,
        type,
      },
    });
  }

  public get filter(): CastMemberFilter | null {
    return this._filter;
  }

  public set filter(value: CastMemberFilter) {
    const _value =
      !value || (value as unknown) === '' || typeof value !== 'object'
        ? null
        : value;

    const filter = {
      ...(_value.name && { name: `${ _value?.name }` }),
      ...(_value.type && { type: _value.type }),
    };

    this._filter = Object.keys(filter).length === 0 ? null : filter;
  }
}

export class CastMemberSearchResult extends DefaultSearchResult<CastMember> {
}

export interface ICastMemberRepository
  extends ISearchableRepository<
    CastMember,
    CastMemberId,
    CastMemberFilter,
    CastMemberSearchParams,
    CastMemberSearchResult
  > {
}
