import {
  Injectable,
  Logger,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { createPlayerDTO } from './dtos/createPlayer.dto';
import { PlayerInterface } from './interfaces/player.interface';

@Injectable()
export class PlayersService {
  constructor(
    @InjectModel('Player') private readonly playerModel: Model<PlayerInterface>,
  ) {}

  private readonly logger = new Logger(PlayersService.name);

  async createUpdatePlayer(
    dto: createPlayerDTO,
  ): Promise<void | PlayerInterface> {
    const { email } = dto;

    const playerFound = await this.playerModel.findOne({ email }).exec();

    if (playerFound) {
      return await this.update(dto);
    } else {
      return await this.create(dto);
    }
  }

  async getAllPlayers(): Promise<PlayerInterface[]> {
    return await this.listPlayers();
  }

  async getPlayer(email: string): Promise<PlayerInterface> {
    return await this.findOne({ email });
  }

  async deletePlayer(id: string): Promise<void> {
    await this.deleteOne({ id });
  }

  private async create(dto: createPlayerDTO): Promise<PlayerInterface> {
    const createdPlayer = new this.playerModel(dto);

    return await createdPlayer.save();
  }

  private async update(dto: createPlayerDTO): Promise<PlayerInterface> {
    const { email } = dto;

    return await this.playerModel
      .findOneAndUpdate({ email }, { $set: dto })
      .exec();
  }

  private async listPlayers(): Promise<PlayerInterface[]> {
    return await this.playerModel.find().exec();
  }

  private async findOne(query): Promise<PlayerInterface> {
    try {
      const player = await this.playerModel
        .findOne({ email: query.email })
        .exec();
      this.logger.log(`player: ${JSON.stringify(player)}`);
      return player;
    } catch (err) {
      throw new NotFoundException(`Player with email ${query.email} not found`);
    }
  }

  private async deleteOne(query): Promise<PlayerInterface> {
    const { id } = query;

    try {
      const deletedPlayer = await this.playerModel.findByIdAndRemove(id).exec();
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
