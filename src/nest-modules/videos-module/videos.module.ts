import { Module } from '@nestjs/common';
import { VideosController } from './videos.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  AudioVideoMediaModel,
  ImageMediaModel,
  VideoCastMemberModel,
  VideoCategoryModel,
  VideoGenreModel,
  VideoModel,
} from '@core/video/infra/db/sequelize';
import { CategoriesModule } from '../categories-module';
import { GenresModule } from '../genres-module/genres.module';
import { CastMembersModule } from '../cast-members-module';
import { VIDEOS_PROVIDERS } from './video.providers';

@Module({
  imports: [
    SequelizeModule.forFeature([
      VideoModel,
      VideoCategoryModel,
      VideoGenreModel,
      VideoCastMemberModel,
      ImageMediaModel,
      AudioVideoMediaModel,
    ]),
    CategoriesModule,
    GenresModule,
    CastMembersModule,
  ],
  controllers: [VideosController],
  providers: [
    ...Object.values(VIDEOS_PROVIDERS.REPOSITORIES),
    ...Object.values(VIDEOS_PROVIDERS.USE_CASES),
  ],
})
export class VideosModule {
}
