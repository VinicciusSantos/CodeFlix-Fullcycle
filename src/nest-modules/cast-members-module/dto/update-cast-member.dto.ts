import { OmitType } from '@nestjs/mapped-types';
import { UpdateCastMemberInput } from '@core/cast-member/application/use-cases';

export class UpdateCastMemberInputWithoutId extends OmitType(
  UpdateCastMemberInput,
  ['id'],
) {
}

export class UpdateCastMemberDto extends UpdateCastMemberInputWithoutId {
}
