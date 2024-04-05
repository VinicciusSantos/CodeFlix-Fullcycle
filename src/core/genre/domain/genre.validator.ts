import { MaxLength } from 'class-validator';
import { Genre } from '@core/genre/domain/genre.aggregate';
import { ClassValidatorFields } from '@core/shared/domain/validators';
import { Notification } from '@core/shared/domain/validators/notification';

export class GenreRules {
  @MaxLength(255, { groups: ['name'] })
  public name: string;

  constructor(entity: Genre) {
    this.name = entity.name;
  }
}

export class GenreValidator extends ClassValidatorFields {
  public validate(
    notification: Notification,
    data: Genre,
    fields?: string[],
  ): boolean {
    const _fields = fields?.length ? fields : ['name'];
    return super.validate(notification, new GenreRules(data), _fields);
  }
}

export class GenreValidatorFactory {
  public static create() {
    return new GenreValidator();
  }
}
