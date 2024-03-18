import { CategoryOutput } from '@core/category/application/use-cases';
import { Transform } from 'class-transformer';

export class CategoryPresenter {
  public id: string;
  public name: string;
  public description: string | null;
  public is_active: boolean;

  @Transform(({ value }: { value: Date }) => value.toISOString())
  public created_at: Date;

  constructor(output: CategoryOutput) {
    this.id = output.id;
    this.name = output.name;
    this.description = output.description;
    this.created_at = output.created_at;
    this.is_active = output.is_active;
  }
}
