import { SequelizeOptions } from 'sequelize-typescript';
import { setupSequelize } from '@core/shared/infra/testing/helpers';
import {
  ImageMediaModel,
  AudioVideoMediaModel,
  VideoCastMemberModel,
  VideoCategoryModel,
  VideoGenreModel,
  VideoModel,
} from '@core/video/infra/db/sequelize';
import { CategoryModel } from '@core/category/infra/db/sequelize';
import { GenreModel } from '@core/genre/infra/db/sequelize/genre.model';
import { GenreCategoryModel } from '@core/genre/infra/db/sequelize/genre-category.model';
import { CastMemberModel } from '@core/cast-member/infra/db/sequelize';

export function setupSequelizeForVideo(options: SequelizeOptions = {}) {
  return setupSequelize({
    models: [
      ImageMediaModel,
      VideoModel,
      AudioVideoMediaModel,
      VideoCategoryModel,
      CategoryModel,
      VideoGenreModel,
      GenreModel,
      GenreCategoryModel,
      VideoCastMemberModel,
      CastMemberModel,
    ],
    ...options,
  });
}
