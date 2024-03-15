import {
  CategorySearchParams,
  CategorySearchResult,
  ICategoryRepository,
} from '../../../domain/category.repository';
import { Category } from '../../../domain/category.entity';
import { Op } from 'sequelize';
import { Uuid } from '@core/shared/domain/value-objects/uuid.vo';
import { CategoryModel } from './category.model';
import { NotFoundError } from '@core/shared/domain/errors/not-found.error';
import { CategoryModelMapper } from './category-model-mapper';

export class CategorySequelizeRepository implements ICategoryRepository {
  public readonly sortableFields: string[] = ['name', 'created_at'];

  constructor(private categoryModel: typeof CategoryModel) {}

  public async insert(entity: Category): Promise<void> {
    const model = CategoryModelMapper.toModel(entity);
    await this.categoryModel.create(model.toJSON());
  }

  public async bulkInsert(entities: Category[]): Promise<void> {
    await this.categoryModel.bulkCreate(
      entities.map((e) => CategoryModelMapper.toModel(e).toJSON()),
    );
  }

  public async findAll(): Promise<Category[]> {
    const response = await this.categoryModel.findAll();
    return response.map(CategoryModelMapper.toEntity);
  }

  public async findById(entity_id: Uuid): Promise<Category | null> {
    return this._get(entity_id.id);
  }

  public getEntity(): { new (...args: any[]): Category } {
    return Category;
  }

  public async update(entity: Category): Promise<void> {
    const { id } = entity.category_id;
    const element = await this._get(id);
    if (!element) {
      throw new NotFoundError(id, Category);
    }
    const modelToUpdate = CategoryModelMapper.toModel(entity);
    await this.categoryModel.update(modelToUpdate.toJSON(), {
      returning: false,
      where: { category_id: id },
    });
  }

  public async delete(category_id: Uuid): Promise<void> {
    const element = await this._get(category_id.id);
    if (!element) {
      throw new NotFoundError(category_id, Category);
    }
    await this.categoryModel.destroy({
      where: { category_id: category_id.id },
    });
  }

  public async search(
    props: CategorySearchParams,
  ): Promise<CategorySearchResult> {
    const { filter, page, per_page, sort, sort_dir } = props;
    const offset = (page - 1) * per_page;
    const { rows, count } = await this.categoryModel.findAndCountAll({
      ...(filter && { where: { name: { [Op.like]: `%${filter}%` } } }),
      order: [
        sort && this.sortableFields.includes(sort)
          ? [sort, sort_dir!]
          : ['created_at', 'desc'],
      ],
      limit: per_page,
      offset,
    });

    return new CategorySearchResult({
      items: rows.map(CategoryModelMapper.toEntity),
      total: count,
      current_page: page,
      per_page,
    });
  }

  private async _get(id: string): Promise<Category | null> {
    const model = await this.categoryModel.findByPk(id);
    if (!model) {
      return null;
    }
    return CategoryModelMapper.toEntity(model);
  }
}
