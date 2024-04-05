import { GenreModel } from '@core/genre/infra/db/sequelize/genre.model';
import {
  Genre,
  GenreConstructorProps,
  GenreId,
} from '@core/genre/domain/genre.aggregate';
import { GenreCategoryModel } from '@core/genre/infra/db/sequelize/genre-category.model';
import { CategoryId } from '@core/category/domain/category.aggregate';
import {
  LoadEntityError,
  Notification,
} from '@core/shared/domain/validators';

export class GenreModelMapper {
  public static toAggregate(model: GenreModel): Genre {
    const {
      genre_id: id,
      categories_id = [],
      ...otherData
    } = model.toJSON();
    const categoriesId = categories_id.map(c => new CategoryId(c.category_id));

    const notification = new Notification();
    if (!categoriesId.length) {
      notification.addError('categories_id should not be empty', 'categories_id');
    }

    const genre = new Genre({
      genre_id: new GenreId(id),
      categories_id: new Map(categoriesId.map((c) => [c.id, c])),
      ...otherData,
    } as GenreConstructorProps);

    genre.validate();
    notification.copyErrors(genre.notification);

    if (notification.hasErrors()) {
      throw new LoadEntityError(notification.toJSON());
    }

    return genre;
  }

  public static toModelProps(aggregate: Genre) {
    const {
      categories_id,
      ...otherData
    } = aggregate.toJSON();
    return {
      ...otherData,
      categories_id: categories_id.map((categoryId) => new GenreCategoryModel({
        genre_id: aggregate.genre_id.id,
        category_id: categoryId,
      })),
    };
  }
}
