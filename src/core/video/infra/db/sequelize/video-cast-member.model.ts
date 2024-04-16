import {
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { CastMemberModel } from '@core/cast-member/infra/db/sequelize';
import { VideoModel } from '@core/video/infra/db/sequelize/video.model';

export interface VideoCastMemberModelProps {
  video_id: string;
  cast_member_id: string;
}

@Table({
  tableName: 'cast_member_video',
  timestamps: false,
})
export class VideoCastMemberModel extends Model<VideoCastMemberModelProps> {
  @PrimaryKey
  @ForeignKey(() => VideoModel)
  @Column({ type: DataType.UUID })
  declare video_id: string;

  @PrimaryKey
  @ForeignKey(() => CastMemberModel)
  @Column({ type: DataType.UUID })
  declare cast_member_id: string;
}
