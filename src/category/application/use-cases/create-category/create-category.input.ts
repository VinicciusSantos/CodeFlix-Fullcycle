import { IsBoolean, IsNotEmpty, IsOptional, IsString, validateSync } from "class-validator";

export interface CreateCategoryInputConstructorProps {
  name: string;
  description?: string;
  is_active?: boolean;
}

export class CreateCategoryInput {
  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  constructor(props?: CreateCategoryInputConstructorProps) {
    if (props) {
      this.name = props.name;
      this.description = props.description;
      this.is_active = props.is_active;
    }
  }
}

export class ValidateCreateCategoryInput {
  public static validate(input: CreateCategoryInput) {
    return validateSync(input);
  }
}
