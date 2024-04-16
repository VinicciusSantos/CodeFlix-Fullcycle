import { setupSequelizeForVideo } from '@core/video/infra/db/sequelize/testing/helpers';
import { VideoCastMemberModel } from '@core/video/infra/db/sequelize';
import { DataType } from 'sequelize-typescript';

describe('VideoCastMemberModel Unit Tests', () => {
  setupSequelizeForVideo();

  test('table name', () => {
    expect(VideoCastMemberModel.tableName).toBe('cast_member_video');
  });

  test('mapping props', () => {
    const attributesMap = VideoCastMemberModel.getAttributes();
    const attributes = Object.keys(VideoCastMemberModel.getAttributes());
    expect(attributes).toStrictEqual(['video_id', 'cast_member_id']);

    const videoIdAttr = attributesMap.video_id;
    expect(videoIdAttr).toMatchObject({
      field: 'video_id',
      fieldName: 'video_id',
      primaryKey: true,
      type: DataType.UUID(),
      references: {
        model: 'videos',
        key: 'video_id',
      },
      unique: 'cast_member_video_video_id_cast_member_id_unique',
    });

    const castMemberIdAttr = attributesMap.cast_member_id;
    expect(castMemberIdAttr).toMatchObject({
      field: 'cast_member_id',
      fieldName: 'cast_member_id',
      primaryKey: true,
      type: DataType.UUID(),
      references: {
        model: 'cast_members',
        key: 'cast_member_id',
      },
      unique: 'cast_member_video_video_id_cast_member_id_unique',
    });
  });
});
