import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CustomValidationParamsPipe } from 'src/common/pipes/custom-validation-params';
import { CategoriesService } from './categories.service';
import { createCategoryDTO } from './dtos/createCategory.dto';
import { updateCategoryDTO } from './dtos/updateCategory.dto';
import { CategoryInterface } from './interfaces/category.interface';

@Controller('api/v1/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async create(@Body() dto: createCategoryDTO): Promise<CategoryInterface> {
    return await this.categoriesService.createCategory(dto);
  }

  @Put(':category')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async update(
    @Param('category', CustomValidationParamsPipe) category: string,
    @Body() dto: updateCategoryDTO,
  ) {
    return await this.categoriesService.updateCategory(category, dto);
  }

  @Post(':category/players/:playerId')
  async addPlayerToCategory(@Param() params: string[]): Promise<void> {
    await this.categoriesService.addPlayerToCategory(params);
  }

  @Get()
  async getAll(): Promise<string> {
    return JSON.stringify({
      data: {
        categories: await this.categoriesService.getAllCategories(),
      },
      success: true,
    });
  }

  @Get(':category')
  async getOne(
    @Param('category', CustomValidationParamsPipe) category: string,
  ): Promise<string> {
    return JSON.stringify({
      data: {
        category: await this.categoriesService.getCategory(category),
      },
      success: true,
    });
  }

  @Delete(':id')
  async deleteOne(
    @Param('id', CustomValidationParamsPipe) id: string,
  ): Promise<void> {
    await this.categoriesService.deleteCategory(id);
  }
}
