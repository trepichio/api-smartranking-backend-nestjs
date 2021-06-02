import {
  Injectable,
  Logger,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { createPlayerDTO } from './dtos/createPlayer.dto';
import { updatePlayerDTO } from './dtos/updatePlayer.dto';
import { PlayerInterface } from './interfaces/player.interface';

@Injectable()
export class PlayersService {
  constructor(
    @InjectModel('Player') private readonly playerModel: Model<PlayerInterface>,
  ) {}

  private readonly logger = new Logger(PlayersService.name);

  async createPlayer(dto: createPlayerDTO): Promise<PlayerInterface> {
    const { email } = dto;

    const playerFound = await this.playerModel.findOne({ email }).exec();

    if (playerFound) {
      throw new BadRequestException(
        'This player cannot be created because it does already exist.',
      );
    }
    return await this.create(dto);
  }

  async updatePlayer(id: string, dto: updatePlayerDTO): Promise<void> {
    const playerFound = await this.playerModel.findById(id).exec();

    if (!playerFound) {
      throw new NotFoundException(
        'This player cannot be updated because it has not be found.',
      );
    }
    return await this.update(playerFound.id, dto);
  }

  async getAllPlayers(): Promise<PlayerInterface[]> {
    return await this.listPlayers();
  }

  async getPlayer(email: string): Promise<PlayerInterface> {
    return await this.findOne({ email });
  }

  async getPlayerById(id: string): Promise<PlayerInterface> {
    return await this.findOneById(id);
  }

  async deletePlayer(id: string): Promise<void> {
    await this.deleteOne({ id });
  }

  private async create(dto: createPlayerDTO): Promise<PlayerInterface> {
    const createdPlayer = new this.playerModel(dto);

    return await createdPlayer.save();
  }

  private async update(id: string, dto: updatePlayerDTO): Promise<void> {
    await this.playerModel.findByIdAndUpdate(id, { $set: dto }).exec();
  }

  private async listPlayers(): Promise<PlayerInterface[]> {
    return await this.playerModel.find().exec();
  }

  private async findOne(query): Promise<PlayerInterface> {
    try {
      const player = await this.playerModel
        .findOne({ email: query.email })
        .exec();

      if (!player) {
        throw new Error('');
      }

      this.logger.log(`player: ${JSON.stringify(player)}`);
      return player;
    } catch (err) {
      throw new NotFoundException(`Player with email ${query.email} not found`);
    }
  }

  private async findOneById(id): Promise<PlayerInterface> {
    try {
      const player = await this.playerModel.findById(id).exec();

      if (!player) {
        throw new Error('');
      }

      this.logger.log(`player: ${JSON.stringify(player)}`);
      return player;
    } catch (err) {
      throw new NotFoundException(`Player with id ${id} not found`);
    }
  }

  private async deleteOne(query): Promise<PlayerInterface> {
    const { id } = query;

    try {
      const deletedPlayer = await this.playerModel.findByIdAndDelete(id).exec();
      if (!deletedPlayer) {
        throw new Error(`Player with id ${id} does not exist`);
      }
      this.logger.log(`deleted player with id: ${JSON.stringify(id)}`);
      return deletedPlayer;
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(
        `Could not delete player with id ${id}.`,
      );
    }
  }
}
