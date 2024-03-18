import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  ParseUUIDPipe,
  HttpCode,
  Query,
} from '@nestjs/common';
import {
  CreateCategoryDto,
  SearchCategoriesDto,
  UpdateCategoryDto,
} from './dto';
import {
  CategoryOutput,
  CreateCategoryUseCase,
  DeleteCategoryUseCase,
  GetCategoryUseCase,
  ListCategoriesOutput,
  ListCategoriesUseCase,
  UpdateCategoryInput,
  UpdateCategoryUseCase,
} from '@core/category/application/use-cases';
import { CategoryPresenter } from './categories.presenter';
import { CollectionPresenter } from '../shared-module';

@Controller('categories')
export class CategoriesController {
  @Inject(CreateCategoryUseCase)
  private createUseCase: CreateCategoryUseCase;

  @Inject(UpdateCategoryUseCase)
  private updateUseCase: UpdateCategoryUseCase;

  @Inject(DeleteCategoryUseCase)
  private deleteUseCase: DeleteCategoryUseCase;

  @Inject(GetCategoryUseCase)
  private getUseCase: GetCategoryUseCase;

  @Inject(ListCategoriesUseCase)
  private listUseCase: ListCategoriesUseCase;


  @Post()
  public async create(@Body() createCategoryDto: CreateCategoryDto) {
    const output = await this.createUseCase.execute(createCategoryDto);
    return CategoriesController.serialize(output);
  }

  @Get()
  public async search(
    @Query() searchParamsDto: SearchCategoriesDto,
  ) {
    const output = await this.listUseCase.execute(searchParamsDto);
    return new CategoryCollectionPresenter(output);
  }

  @Get(':id')
  public async findOne(@Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string) {
    const output = await this.getUseCase.execute({ id });
    return CategoriesController.serialize(output);
  }

  @Patch(':id')
  public async update(
    @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    const output = await this.updateUseCase.execute({
      ...updateCategoryDto,
      id,
    } as UpdateCategoryInput);
    return CategoriesController.serialize(output);
  }

  @HttpCode(204)
  @Delete(':id')
  public async remove(
    @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string,
  ) {
    return this.deleteUseCase.execute({ id });
  }

  public static serialize(output: CategoryOutput): CategoryPresenter {
    return new CategoryPresenter(output);
  }
}

export class CategoryCollectionPresenter extends CollectionPresenter {
  public data: CategoryPresenter[];

  constructor(output: ListCategoriesOutput) {
    const {
      items,
      ...paginationProps
    } = output;
    super(paginationProps);
    this.data = items.map((i) => new CategoryPresenter(i));
  }
}
