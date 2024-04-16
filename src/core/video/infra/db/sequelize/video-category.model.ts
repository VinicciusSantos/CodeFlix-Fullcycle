import {
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { CategoryModel } from '@core/category/infra/db/sequelize';
import { VideoModel } from '@core/video/infra/db/sequelize/video.model';

export interface VideoCategoryModelProps {
  video_id: string;
  category_id: string;
}

@Table({
  tableName: 'category_video',
  timestamps: false,
})
export class VideoCategoryModel extends Model<VideoCategoryModelProps> {
  @PrimaryKey
  @ForeignKey(() => VideoModel)
  @Column({ type: DataType.UUID })
  declare video_id: string;

  @PrimaryKey
  @ForeignKey(() => CategoryModel)
  @Column({ type: DataType.UUID })
  declare category_id: string;
}
