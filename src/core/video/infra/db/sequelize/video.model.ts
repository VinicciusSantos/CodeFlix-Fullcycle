import {
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { RatingValues } from '@core/video/domain';
import { CategoryModel } from '@core/category/infra/db/sequelize';
import { CastMemberModel } from '@core/cast-member/infra/db/sequelize';
import { GenreModel } from '@core/genre/infra/db/sequelize/genre.model';
import {
  AudioVideoMediaModel,
  ImageMediaModel,
  VideoCastMemberModel,
  VideoCategoryModel,
  VideoGenreModel,
} from '../sequelize';

export interface VideoModelProps {
  video_id: string;
  title: string;
  description: string;
  year_launched: number;
  duration: number;
  rating: RatingValues;
  is_opened: boolean;
  is_published: boolean;

  image_medias: ImageMediaModel[];
  audio_video_medias: AudioVideoMediaModel[];

  categories_id: VideoCategoryModel[];
  categories?: CategoryModel[];
  genres_id: VideoGenreModel[];
  genres?: CategoryModel[];
  cast_members_id: VideoCastMemberModel[];
  cast_members?: CastMemberModel[];
  created_at: Date;
}

@Table({
  tableName: 'videos',
  timestamps: false,
})
export class VideoModel extends Model<VideoModelProps> {
  @PrimaryKey
  @Column({ type: DataType.UUID })
  declare video_id: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(255),
  })
  declare title: string;

  @Column({
    allowNull: false,
    type: DataType.TEXT,
  })
  declare description: string;

  @Column({
    allowNull: false,
    type: DataType.SMALLINT,
  })
  declare year_launched: number;

  @Column({
    allowNull: false,
    type: DataType.SMALLINT,
  })
  declare duration: number;

  @Column({
    allowNull: false,
    type: DataType.ENUM(...Object.values(RatingValues)),
  })
  declare rating: RatingValues;

  @Column({
    allowNull: false,
    type: DataType.BOOLEAN,
  })
  declare is_opened: boolean;

  @Column({
    allowNull: false,
    type: DataType.BOOLEAN,
  })
  declare is_published: boolean;

  @HasMany(() => ImageMediaModel, 'video_id')
  declare image_medias: ImageMediaModel[];

  @HasMany(() => AudioVideoMediaModel, 'video_id')
  declare audio_video_medias: AudioVideoMediaModel[];

  @HasMany(() => VideoCategoryModel, 'video_id')
  declare categories_id: VideoCategoryModel[];

  @BelongsToMany(() => CategoryModel, () => VideoCategoryModel)
  declare categories?: CategoryModel[];

  @HasMany(() => VideoGenreModel, 'video_id')
  declare genres_id: VideoGenreModel[];

  @BelongsToMany(() => GenreModel, () => VideoGenreModel)
  declare genres?: GenreModel[];

  @HasMany(() => VideoCastMemberModel, 'video_id')
  declare cast_members_id: VideoCastMemberModel[];

  @BelongsToMany(() => CastMemberModel, () => VideoCastMemberModel)
  declare cast_members?: CastMemberModel[];

  @Column({
    allowNull: false,
    type: DataType.DATE(6),
  })
  declare created_at: Date;
}
