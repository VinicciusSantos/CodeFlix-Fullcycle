import {
  CastMemberOutput,
  CastMemberOutputMapper,
} from '../common/cast-member-output';
import {
  IUseCase,
  PaginationOutput,
  PaginationOutputMapper,
} from '@core/shared/application';
import {
  ICastMemberRepository,
  CastMemberSearchParams,
  CastMemberSearchResult,
} from '../../../domain/cast-member.repository';
import { ListCastMembersInput } from './list-cast-members.input';

export class ListCastMembersUseCase
  implements IUseCase<ListCastMembersInput, ListCastMembersOutput> {
  constructor(private castMemberRepo: ICastMemberRepository) {
  }

  async execute(input: ListCastMembersInput): Promise<ListCastMembersOutput> {
    const params = CastMemberSearchParams.create(input);
    const searchResult = await this.castMemberRepo.search(params);
    return this.toOutput(searchResult);
  }

  private toOutput(
    searchResult: CastMemberSearchResult,
  ): ListCastMembersOutput {
    const { items: _items } = searchResult;
    const items = _items.map((i) => {
      return CastMemberOutputMapper.toOutput(i);
    });
    return PaginationOutputMapper.toOutput(items, searchResult);
  }
}

export type ListCastMembersOutput = PaginationOutput<CastMemberOutput>;
