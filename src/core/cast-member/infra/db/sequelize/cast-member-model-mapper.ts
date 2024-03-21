import { CastMemberModel } from '@core/cast-member/infra/db/sequelize/cast-member.model';
import {
  CastMember,
  CastMemberId,
} from '@core/cast-member/domain/cast-member.aggregate';
import { CastMemberType } from '@core/cast-member/domain/cast-member-type.vo';
import { LoadEntityError } from '@core/shared/domain/validators';

export class CastMemberModelMapper {
  public static toAggregate(model: CastMemberModel): CastMember {
    const {
      cast_member_id: id,
      ...otherData
    } = model.toJSON();

    const [type, errorCastMemberType] = CastMemberType.create(
      otherData.type,
    ).asArray();

    const castMember = new CastMember({
      ...otherData,
      cast_member_id: new CastMemberId(id),
      type,
    });

    castMember.validate();

    const notification = castMember.notification;
    if (errorCastMemberType) {
      notification.setError(errorCastMemberType.message, 'type');
    }

    if (notification.hasErrors()) {
      throw new LoadEntityError(notification.toJSON());
    }

    return castMember;
  }
}
