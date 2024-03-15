import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategorySequelizeRepository } from '@core/category/infra/db/sequelize/category-sequelize.repository';

@Controller('categories-module')
export class CategoriesController {
  constructor(private readonly categoryRepo: CategorySequelizeRepository) {
  }

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
