import { IUseCase } from '@core/shared/application/use-case.interface';
import { ICategoryRepository } from '../../../domain/category.repository';
import { CategoryId } from '@core/category/domain/category.aggregate';

export interface DeleteCategoryInput {
  id: string;
}

export type DeleteCategoryOutput = void;

export class DeleteCategoryUseCase
  implements IUseCase<DeleteCategoryInput, DeleteCategoryOutput>
{
  constructor(private categoryRepo: ICategoryRepository) {}

  async execute(input: DeleteCategoryInput): Promise<DeleteCategoryOutput> {
    const uuid = new CategoryId(input.id);
    await this.categoryRepo.delete(uuid);
  }
}
