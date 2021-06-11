import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PlayerInterface } from 'src/players/interfaces/player.interface';
import { PlayersService } from 'src/players/players.service';
import { createCategoryDTO } from './dtos/createCategory.dto';
import { updateCategoryDTO } from './dtos/updateCategory.dto';
import { CategoryInterface } from './interfaces/category.interface';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel('Category')
    private readonly categoryModel: Model<CategoryInterface>,
    private readonly playersService: PlayersService,
  ) {}

  private readonly logger = new Logger(CategoriesService.name);

  async createCategory(dto: createCategoryDTO): Promise<CategoryInterface> {
    const { category } = dto;

    const categoryFound = await this.categoryModel.findOne({ category }).exec();

    if (categoryFound) {
      throw new BadRequestException(
        'This category cannot be created because it does already exist.',
      );
    }
    return await this.create(dto);
  }

  async updateCategory(
    category: string,
    dto: updateCategoryDTO,
  ): Promise<void> {
    const categoryFound = await this.categoryModel.findOne({ category }).exec();

    if (!categoryFound) {
      throw new NotFoundException(
        'This category cannot be updated because it has not be found.',
      );
    }
    return await this.update(categoryFound.id, dto);
  }

  async addPlayerToCategory(params: string[]): Promise<void> {
    const category = params['category'];
    const playerId = params['playerId'];

    const categoryFound = await this.findOne({ category });

    await this.playersService.getPlayerById(playerId);

    const playerAlreadyAdded = categoryFound.players.find(
      (player) => player.id === playerId,
    );

    if (playerAlreadyAdded) {
      throw new BadRequestException(
        `Player ${playerId} is already added to category ${category}`,
      );
    }

    categoryFound.players.push(playerId);

    await this.categoryModel
      .findOneAndUpdate({ category }, { $set: categoryFound })
      .exec();
  }

  async getAllCategories(): Promise<CategoryInterface[]> {
    return await this.listCategories();
  }

  async getCategory(category: string): Promise<CategoryInterface> {
    return await this.findOne({ category });
  }

  async getCategoryById(id: string): Promise<CategoryInterface> {
    return await this.findOneById(id);
  }

  async deleteCategory(id: string): Promise<void> {
    await this.deleteOne({ id });
  }

  async getCategoryByPlayer(
    playerId: PlayerInterface,
  ): Promise<CategoryInterface> {
    return await this.categoryModel
      .findOne({ players: { $all: [playerId] } })
      .exec();
  }

  private async create(dto: createCategoryDTO): Promise<CategoryInterface> {
    const createdCategory = new this.categoryModel(dto);

    return await createdCategory.save();
  }

  private async update(id: string, dto: updateCategoryDTO): Promise<void> {
    await this.categoryModel.findByIdAndUpdate(id, { $set: dto }).exec();
  }

  private async listCategories(): Promise<CategoryInterface[]> {
    return await this.categoryModel.find().populate('players').exec();
  }

  private async findOne(query): Promise<CategoryInterface> {
    try {
      const category = await this.categoryModel
        .findOne({ category: query.category })
        .populate('players')
        .exec();

      if (!category) {
        throw new Error('');
      }

      this.logger.log(`category: ${JSON.stringify(category)}`);
      return category;
    } catch (err) {
      throw new NotFoundException(`Category ${query.category} not found`);
    }
  }

  private async findOneById(id): Promise<CategoryInterface> {
    try {
      const category = await this.categoryModel.findById(id).exec();

      if (!category) {
        throw new Error('');
      }

      this.logger.log(`category: ${JSON.stringify(category)}`);
      return category;
    } catch (err) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }
  }

  private async deleteOne(query): Promise<CategoryInterface> {
    const { id } = query;

    try {
      const deletedCategory = await this.categoryModel
        .findByIdAndDelete(id)
        .exec();
      if (!deletedCategory) {
        throw new Error(`Category with id ${id} does not exist`);
      }
      this.logger.log(`deleted category with id: ${JSON.stringify(id)}`);
      return deletedCategory;
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(
        `Could not delete category with id ${id}.`,
      );
    }
  }
}
