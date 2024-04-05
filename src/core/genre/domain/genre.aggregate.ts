import { AggregateRoot } from '@core/shared/domain/aggregate-root';
import { CategoryId } from '@core/category/domain/category.aggregate';
import { Uuid } from '@core/shared/domain/value-objects';
import { GenreValidatorFactory } from '@core/genre/domain/genre.validator';
import { GenreFakeBuilder } from '@core/genre/domain/genre-fake.builder';

export interface GenreConstructorProps {
  genre_id?: GenreId;
  name: string;
  categories_id: Map<string, CategoryId>;
  is_active?: boolean;
  created_at?: Date;
}

export interface GenreCreateCommand {
  name: string;
  categories_id: CategoryId[];
  is_active?: boolean;
}

export class GenreId extends Uuid {
}

export class Genre extends AggregateRoot {
  public genre_id: GenreId;
  public name: string;
  public categories_id: Map<string, CategoryId>;
  public is_active: boolean;
  public created_at: Date;

  public get entity_id(): GenreId {
    return this.genre_id;
  }

  constructor(props: GenreConstructorProps) {
    super();
    this.genre_id = props.genre_id ?? new GenreId();
    this.name = props.name;
    this.categories_id = props.categories_id;
    this.is_active = props.is_active ?? true;
    this.created_at = props.created_at ?? new Date();
  }

  public static create(props: GenreCreateCommand): Genre {
    const genre = new Genre({
      ...props,
      categories_id: new Map<string, CategoryId>(
        props.categories_id.map((categoryId) => [categoryId.id, categoryId]),
      ),
    });
    genre.validate();
    return genre;
  }

  public static fake() {
    return GenreFakeBuilder;
  }

  public changeName(name: string): void {
    this.name = name;
    this.validate(['name']);
  }

  public addCategoryId(category_id: CategoryId): void {
    this.categories_id.set(category_id.id, category_id);
  }

  public removeCategoryId(category_id: CategoryId): void {
    this.categories_id.delete(category_id.id);
  }

  public syncCategoriesId(categories_id: CategoryId[]): void {
    if (!categories_id.length) {
      throw new Error('Categories ID is empty');
    }

    this.categories_id = new Map<string, CategoryId>(
      categories_id.map((categoryId) => [categoryId.id, categoryId]),
    );
  }

  public activate(): void {
    this.is_active = true;
  }

  public deactivate(): void {
    this.is_active = false;
  }

  public validate(fields?: string[]): boolean {
    const validator = GenreValidatorFactory.create();
    return validator.validate(this.notification, this, fields);
  }

  public toJSON() {
    return {
      genre_id: this.genre_id.id,
      name: this.name,
      categories_id: Array.from(this.categories_id.values()).map(({ id }) => id),
      is_active: this.is_active,
      created_at: this.created_at,
    };
  }
}
