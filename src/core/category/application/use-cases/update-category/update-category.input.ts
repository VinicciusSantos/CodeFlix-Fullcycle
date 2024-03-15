import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  validateSync,
} from 'class-validator';

export interface UpdateCategoryInputConstructorProps {
  id: string;
  name?: string;
  description?: string;
  is_active?: boolean;
}

export class UpdateCategoryInput {
  @IsString()
  @IsNotEmpty()
  public id: string;

  @IsString()
  @IsOptional()
  public name?: string;

  @IsString()
  @IsOptional()
  public description?: string;

  @IsBoolean()
  @IsOptional()
  public is_active?: boolean;

  constructor(props?: UpdateCategoryInputConstructorProps) {
    if (props) {
      this.id = props.id;
      this.name = props.name;
      this.description = props.description;
      this.is_active = props.is_active;
    }
  }
}

export class ValidateUpdateCategoryInput {
  public static validate(input: UpdateCategoryInput) {
    return validateSync(input);
  }
}
