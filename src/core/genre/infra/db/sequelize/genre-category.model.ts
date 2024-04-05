import {
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { CategoryModel } from '@core/category/infra/db/sequelize';
import { GenreModel } from '@core/genre/infra/db/sequelize/genre.model';

export interface GenreCategoryModelProps {
  genre_id: string;
  category_id: string;
}

@Table({
  tableName: 'category_genre',
  timestamps: false,
})
export class GenreCategoryModel extends Model<GenreCategoryModelProps> {
  @PrimaryKey
  @ForeignKey(() => GenreModel)
  @Column({ type: DataType.UUID })
  declare genre_id: string;

  @PrimaryKey
  @ForeignKey(() => CategoryModel)
  @Column({ type: DataType.UUID })
  declare category_id: string;
}
