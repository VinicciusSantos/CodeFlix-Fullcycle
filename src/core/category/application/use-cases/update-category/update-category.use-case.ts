import { NotFoundError } from '@core/shared/domain/errors/not-found.error';
import { Uuid } from '@core/shared/domain/value-objects/uuid.vo';
import { Category } from '../../../domain/category.entity';
import { ICategoryRepository } from '../../../domain/category.repository';
import { IUseCase } from '@core/shared/application/use-case.interface';
import {
  CategoryOutput,
  CategoryOutputMapper,
} from '../common/category-output';
import { UpdateCategoryInput } from './update-category.input';
import { EntityValidationError } from '@core/shared/domain/validators';

export type UpdateCategoryOutput = CategoryOutput;

export class UpdateCategoryUseCase
  implements IUseCase<UpdateCategoryInput, UpdateCategoryOutput> {
  constructor(private categoryRepo: ICategoryRepository) {
  }

  public async execute(
    input: UpdateCategoryInput,
  ): Promise<UpdateCategoryOutput> {
    const uuid = new Uuid(input.id);
    const category = await this.categoryRepo.findById(uuid);

    if (!category) {
      throw new NotFoundError(input.id, Category);
    }

    input.name && category.changeName(input.name);

    if (input.description !== undefined) {
      category.changeDescription(input.description);
    }

    if (input.is_active === true) {
      category.activate();
    } else if (input.is_active === false) {
      category.deactivate();
    }

    if (category.notification.hasErrors()) {
      throw new EntityValidationError(category.notification.toJSON());
    }

    await this.categoryRepo.update(category);
    return CategoryOutputMapper.toOutput(category);
  }
}
