import { Uuid } from "../../shared/domain/value-objects/uuid.vo";
import { CategoryValidatorFactory } from "./category.validator";
import { EntityValidationError } from "../../shared/domain/validators/validation.error";
import { Entity } from "../../shared/domain/entity";
import { ValueObject } from "../../shared/domain/value-object";

export interface CategoryProps {
  category_id?: Uuid;
  name: string;
  description?: string | null;
  is_active?: boolean;
  created_at?: Date;
}

export interface CategoryCreateCommand {
  name: string;
  description?: string;
  is_active?: boolean;
}

export class Category extends Entity {
  public readonly category_id: Uuid;
  public name: string;
  public description: string | null;
  public is_active: boolean;
  public readonly created_at: Date;

  get entity_id(): ValueObject {
    return this.category_id;
  }

  constructor(props: CategoryProps) {
    super();
    this.category_id = props.category_id ?? new Uuid();
    this.name = props.name;
    this.description = props.description ?? null;
    this.is_active = props.is_active ?? true;
    this.created_at = props.created_at ?? new Date();
  }

  public static create(props: CategoryCreateCommand): Category {
    const category = new Category(props);
    Category.validate(category);
    return category;
  }

  public changeName(name: string): void {
    this.name = name;
    Category.validate(this);
  }

  public changeDescription(description: string): void {
    this.description = description;
    Category.validate(this);
  }

  public activate(): void {
    this.is_active = true;
  }

  public deactivate(): void {
    this.is_active = false;
  }

  static validate(entity: Category) {
    const validator = CategoryValidatorFactory.create();
    if (!validator.validate(entity)) {
      throw new EntityValidationError(validator.errors);
    }
  }

  public toJSON() {
    return {
      category_id: this.category_id.id,
      name: this.name,
      description: this.description,
      is_active: this.is_active,
      created_at: this.created_at,
    };
  }
}
