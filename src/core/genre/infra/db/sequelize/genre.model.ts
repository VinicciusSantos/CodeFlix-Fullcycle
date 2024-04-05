import {
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
  BelongsToMany,
  HasMany,
} from 'sequelize-typescript';
import { CategoryModel } from '@core/category/infra/db/sequelize';
import { GenreCategoryModel } from '@core/genre/infra/db/sequelize/genre-category.model';

export interface GenreModelProps {
  genre_id: string;
  name: string;
  categories_id?: GenreCategoryModel[];
  categories?: CategoryModel[];
  is_active: boolean;
  created_at?: Date;
}

@Table({
  tableName: 'genres',
  timestamps: false,
})
export class GenreModel extends Model<GenreModelProps> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
  })
  declare genre_id: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  declare name: string;

  @HasMany(() => GenreCategoryModel, 'genre_id')
  declare categories_id: GenreCategoryModel[];

  @BelongsToMany(() => CategoryModel, () => GenreCategoryModel)
  declare categories: CategoryModel[];

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  declare is_active: boolean;

  @Column({
    type: DataType.DATE(6),
    allowNull: false,
  })
  declare created_at: Date;
}
