import {
  MaxLength,
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
} from "class-validator";
import { Category } from "./category.entity";
import { ClassValidatorFields } from "../../shared/domain/validators/class-validator-fields";

export class CategoryRules {
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  private name: string;

  @IsString()
  @IsOptional()
  private description: string | null;

  @IsBoolean()
  @IsNotEmpty()
  private is_active: boolean;

  constructor({ name, description, is_active }: Category) {
    this.name = name;
    this.description = description;
    this.is_active = is_active;
  }
}

export class CategoryValidator extends ClassValidatorFields<CategoryRules> {
  validate(entity: Category) {
    return super.validate(new CategoryRules(entity));
  }
}

export class CategoryValidatorFactory {
  static create() {
    return new CategoryValidator();
  }
}
