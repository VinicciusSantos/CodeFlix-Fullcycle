import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete, Inject,
} from '@nestjs/common';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import {
  CreateCategoryUseCase,
  DeleteCategoryUseCase,
  GetCategoryUseCase,
  ListCategoriesUseCase,
  UpdateCategoryUseCase,
} from '@core/category/application/use-cases';

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
  public create(@Body() createCategoryDto: CreateCategoryDto) {

  }

  @Get()
  public findAll() {

  }

  @Get(':id')
  public findOne(@Param('id') id: string) {

  }

  @Patch(':id')
  public update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {

  }

  @Delete(':id')
  public remove(@Param('id') id: string) {

  }
}
