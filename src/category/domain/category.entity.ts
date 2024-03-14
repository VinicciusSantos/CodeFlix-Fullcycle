import { Uuid } from "../../shared/domain/value-objects/uuid.vo";

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

export class Category {
  public readonly category_id: Uuid;
  public name: string;
  public description: string | null;
  public is_active: boolean;
  public readonly created_at: Date;

  constructor(props: CategoryProps) {
    this.category_id = props.category_id ?? new Uuid();
    this.name = props.name;
    this.description = props.description ?? null;
    this.is_active = props.is_active ?? true;
    this.created_at = props.created_at ?? new Date();
  }

  public static create(props: CategoryCreateCommand): Category {
    return new Category(props);
  }

  public changeName(name: string): void {
    this.name = name;
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
