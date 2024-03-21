import { MaxLength } from 'class-validator';
import { ClassValidatorFields } from '@core/shared/domain/validators';
import { CastMember } from './cast-member.aggregate';
import { Notification } from '@core/shared/domain/validators';

export class CastMemberRules {
  @MaxLength(255, { groups: ['name'] })
  public name: string;

  constructor(entity: CastMember) {
    this.name = entity.name;
  }
}

export class CastMemberValidator extends ClassValidatorFields {
  validate(
    notification: Notification,
    data: CastMember,
    fields: string[],
  ): boolean {
    const newFields = fields?.length ? fields : ['name'];
    return super.validate(notification, new CastMemberRules(data), newFields);
  }
}

export class CastMemberValidatorFactory {
  public static create(): CastMemberValidator {
    return new CastMemberValidator();
  }
}

export default CastMemberValidatorFactory;
