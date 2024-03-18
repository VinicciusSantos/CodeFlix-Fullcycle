import { Category } from '../../../domain/category.entity';
import {
  FindAndCountOptions,
  literal,
  Op,
  UpdateOptions,
} from 'sequelize';
import { Uuid } from '@core/shared/domain/value-objects/uuid.vo';
import { CategoryModel } from './category.model';
import { NotFoundError } from '@core/shared/domain/errors/not-found.error';
import { CategoryModelMapper } from './category-model-mapper';
import {
  CategorySearchParams,
  CategorySearchResult,
  ICategoryRepository,
} from '@core/category/domain/category.repository';
import { SortDirection } from '@core/shared/domain/repository';

export class CategorySequelizeRepository implements ICategoryRepository {
  sortableFields: string[] = ['name', 'created_at'];
  orderBy = {
    mysql: {
      name: (sort_dir: SortDirection) => literal(`binary name ${sort_dir}`), //ascii
    },
  };

  constructor(private categoryModel: typeof CategoryModel) {}

  async insert(entity: Category): Promise<void> {
    const modelProps = CategoryModelMapper.toModel(entity);
    await this.categoryModel.create(modelProps.toJSON());
  }

  async bulkInsert(entities: Category[]): Promise<void> {
    const modelsProps = entities.map((entity) =>
      CategoryModelMapper.toModel(entity).toJSON(),
    );
    await this.categoryModel.bulkCreate(modelsProps);
  }

  async update(entity: Category): Promise<void> {
    const id = entity.category_id.id;

    const modelProps = CategoryModelMapper.toModel(entity);
    const [affectedRows] = await this.categoryModel.update(
      modelProps.toJSON(),
      {
        where: { category_id: entity.category_id.id },
      } as UpdateOptions,
    );

    if (affectedRows !== 1) {
      throw new NotFoundError(id, this.getEntity());
    }
  }

  async delete(category_id: Uuid): Promise<void> {
    const id = category_id.id;

    const affectedRows = await this.categoryModel.destroy({
      where: { category_id: id },
    });

    if (affectedRows !== 1) {
      throw new NotFoundError(id, this.getEntity());
    }
  }

  async findById(entity_id: Uuid): Promise<Category | null> {
    const model = await this.categoryModel.findByPk(entity_id.id);
    return model ? CategoryModelMapper.toEntity(model) : null;
  }

  async findAll(): Promise<Category[]> {
    const models = await this.categoryModel.findAll();
    return models.map((model) => {
      return CategoryModelMapper.toEntity(model);
    });
  }

  public async search(
    props: CategorySearchParams,
  ): Promise<CategorySearchResult> {
    const {
      filter,
      page,
      per_page,
      sort,
      sort_dir,
    } = props;
    const offset = (page - 1) * per_page;
    const {
      rows,
      count,
    } = await this.categoryModel.findAndCountAll({
      ...(filter && { where: { name: { [Op.like]: `%${ filter }%` } } }),
      ...(sort && this.sortableFields.includes(sort)
        ? { order: this.formatSort(sort, sort_dir) }
        : { order: [['created_at', 'desc']] }),
      limit: per_page,
      offset,
    } as FindAndCountOptions);

    return new CategorySearchResult({
      items: rows.map(CategoryModelMapper.toEntity),
      total: count,
      current_page: page,
      per_page,
    });
  }

  private formatSort(sort: string, sort_dir: SortDirection) {
    const dialect = this.categoryModel.sequelize.getDialect() as 'mysql';
    if (this.orderBy[dialect] && this.orderBy[dialect][sort]) {
      return this.orderBy[dialect][sort](sort_dir);
    }
    return [[sort, sort_dir]];
  }

  getEntity(): new (...args: any[]) => Category {
    return Category;
  }
}
