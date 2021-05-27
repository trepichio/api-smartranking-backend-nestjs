import {
  Injectable,
  Logger,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { createPlayerDTO } from './dtos/createPlayer.dto';
import { PlayerInterface } from './interfaces/player.interface';

@Injectable()
export class PlayersService {
  private readonly logger = new Logger(PlayersService.name);

  private players: PlayerInterface[] = [];

  async createUpdatePlayer(
    dto: createPlayerDTO,
  ): Promise<void | PlayerInterface> {
    const { email } = dto;

    const playerIndex = this.players.findIndex(
      (player) => player.email === email,
    );

    if (playerIndex !== -1) {
      return this.update(dto, playerIndex);
    } else {
      return this.create(dto);
    }
  }

  async getAllPlayers(): Promise<PlayerInterface[]> {
    return this.listPlayers();
  }

  async getPlayer(email: string): Promise<PlayerInterface> {
    return this.findOne({ email });
  }

  async deletePlayer(id: string): Promise<void> {
    this.deleteOne({ id });
  }

  private create(dto: createPlayerDTO): void {
    const { name, email, mobileNumber } = dto;

    const player: PlayerInterface = {
      _id: randomUUID(),
      name,
      email,
      mobileNumber,
      ranking: 'A',
      rankingPosition: 1,
      urlProfilePicture: 'http://fakeimg.pl/50x50?font=lobster',
    };

    this.logger.log(`createPlayerDTO: ${JSON.stringify(player)}`);

    this.players = [...this.players, player];
  }

  private update(dto: createPlayerDTO, playerIndex = -1): PlayerInterface {
    const { email } = dto;

    if (playerIndex === -1) {
      playerIndex = this.players.findIndex((player) => player.email === email);
    }

    this.logger.log(
      `old player info: ${JSON.stringify(this.players[playerIndex])}`,
    );

    this.players[playerIndex] = Object.assign(
      {},
      this.players[playerIndex],
      dto,
    );

    this.logger.log(
      `updated player info: ${JSON.stringify(this.players[playerIndex])}`,
    );

    return this.players[playerIndex];
  }

  private listPlayers(): PlayerInterface[] {
    return this.players;
  }

  private findOne(query): PlayerInterface {
    const player = this.players.find((player) => player.email === query.email);

    if (!player) {
      throw new NotFoundException(`Player with email ${query.email} not found`);
    }
    this.logger.log(`player: ${JSON.stringify(player)}`);
    return player;
  }

  private deleteOne(query): void {
    const { id } = query;

    const playerIndex = this.players.findIndex((player) => player._id === id);

    if (playerIndex === -1) {
      throw new InternalServerErrorException(
        `Could not delete player with id ${id}.`,
      );
    }
    this.logger.log(`deleted player with id: ${JSON.stringify(id)}`);
    this.players.splice(playerIndex, 1);
  }
}
