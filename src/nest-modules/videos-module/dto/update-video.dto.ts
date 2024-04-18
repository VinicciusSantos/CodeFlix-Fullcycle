import { OmitType } from '@nestjs/mapped-types';
import { UpdateVideoInput } from '@core/video/application/use-cases';

export class UpdateVideoDto
  extends OmitType(UpdateVideoInput, ['id']) {
}
