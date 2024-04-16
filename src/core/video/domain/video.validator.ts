import { MaxLength } from 'class-validator';
import { Video } from './video.aggregate';
import {
  Notification,
  ClassValidatorFields,
} from '@core/shared/domain/validators';

export class VideoRules {
  @MaxLength(255, { groups: ['title'] })
  title: string;

  constructor(aggregate: Video) {
    Object.assign(this, aggregate);
  }
}

export class VideoValidator extends ClassValidatorFields {
  public validate(
    notification: Notification,
    data: Video,
    fields?: string[],
  ): boolean {
    const newFields = fields?.length ? fields : ['title'];
    return super.validate(notification, new VideoRules(data), newFields);
  }
}

export class VideoValidatorFactory {
  public static create(): VideoValidator {
    return new VideoValidator();
  }
}

export default VideoValidatorFactory;
