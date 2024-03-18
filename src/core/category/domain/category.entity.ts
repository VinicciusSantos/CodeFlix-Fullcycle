import { CategoryValidatorFactory } from './category.validator';
import { CategoryFakeBuilder } from './category-fake.builder';
import { Entity } from '@core/shared/domain/entity';
import { Uuid, ValueObject } from '@core/shared/domain/value-objects';

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

export class Category
  extends Entity {
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
    category.validate(['name']);
    return category;
  }

  public changeName(name: string): void {
    this.name = name;
    this.validate(['name']);
  }

  public changeDescription(description: string): void {
    this.description = description;
  }

  public activate(): void {
    this.is_active = true;
  }

  public deactivate(): void {
    this.is_active = false;
  }

  public static fake() {
    return CategoryFakeBuilder;
  }

  public validate(fields?: string[]) {
    const validator = CategoryValidatorFactory.create();
    return validator.validate(this.notification, this, fields);
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
