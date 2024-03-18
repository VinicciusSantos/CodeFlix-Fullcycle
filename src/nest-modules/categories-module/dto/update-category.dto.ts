import { UpdateCategoryInput } from '@core/category/application/use-cases';
import { OmitType } from '@nestjs/mapped-types';

class UpdateCategoryInputWithoutId
  extends OmitType(
    UpdateCategoryInput,
    ['id'] as const) {
}

export class UpdateCategoryDto
  extends UpdateCategoryInputWithoutId {
}
