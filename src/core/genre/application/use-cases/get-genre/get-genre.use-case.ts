import { ICategoryRepository } from '@core/category/domain/category.repository';
import { IUseCase } from '@core/shared/application';
import { NotFoundError } from '@core/shared/domain/errors';
import {
  Genre,
  GenreId,
} from '../../../domain/genre.aggregate';
import { IGenreRepository } from '../../../domain/genre.repository';
import {
  GenreOutput,
  GenreOutputMapper,
} from '../common/genre-output';

export interface GetGenreInput {
  id: string;
}

export type GetGenreOutput = GenreOutput;

export class GetGenreUseCase
  implements IUseCase<GetGenreInput, GetGenreOutput> {
  constructor(
    private genreRepo: IGenreRepository,
    private categoryRepo: ICategoryRepository,
  ) {
  }

  async execute(input: GetGenreInput): Promise<GetGenreOutput> {
    const genreId = new GenreId(input.id);
    const genre = await this.genreRepo.findById(genreId);
    if (!genre) {
      throw new NotFoundError(input.id, Genre);
    }
    const categories = await this.categoryRepo.findByIds([
      ...genre.categories_id.values(),
    ]);
    return GenreOutputMapper.toOutput(genre, categories);
  }
}
