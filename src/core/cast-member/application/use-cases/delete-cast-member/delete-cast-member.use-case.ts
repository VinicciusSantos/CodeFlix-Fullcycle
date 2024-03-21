import { IUseCase } from '@core/shared/application';
import { CastMemberId } from '../../../domain/cast-member.aggregate';
import { ICastMemberRepository } from '../../../domain/cast-member.repository';

export interface DeleteCastMemberInput {
  id: string;
}

export type DeleteCastMemberOutput = void;

export class DeleteCastMemberUseCase
  implements IUseCase<DeleteCastMemberInput, DeleteCastMemberOutput> {
  constructor(private castMemberRepository: ICastMemberRepository) {
  }

  async execute(input: DeleteCastMemberInput): Promise<DeleteCastMemberOutput> {
    const castMemberId = new CastMemberId(input.id);
    await this.castMemberRepository.delete(castMemberId);
  }
}
