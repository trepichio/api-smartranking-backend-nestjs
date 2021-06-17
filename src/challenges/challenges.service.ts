import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoriesService } from 'src/categories/categories.service';
import { addMatchToChallengeDTO } from 'src/challenges/dtos/addMatchToChallenge.dto';
import { MatchInterface } from 'src/challenges/interfaces/match.interface';
import { PlayersService } from 'src/players/players.service';
import { createChallengeDTO } from './dtos/createChallenge.dto';
import { updateChallengeDTO } from './dtos/updateChallenge.dto';
import { ChallengeInterface } from './interfaces/challenge.interface';
import { ChallengeStatus } from './interfaces/challengeStatus.enum';

@Injectable()
export class ChallengesService {
  constructor(
    @InjectModel('Challenge')
    private readonly challengeModel: Model<ChallengeInterface>,

    @InjectModel('Match')
    private readonly matchModel: Model<MatchInterface>,

    private readonly playersService: PlayersService,
    private readonly categoriesService: CategoriesService,
  ) {}

  private readonly logger = new Logger(ChallengesService.name);

  async getAll(): Promise<ChallengeInterface[]> {
    return await this.challengeModel
      .find()
      .populate('requester')
      .populate('players')
      .populate('match')
      .exec();
  }

  async getAllByPlayerId(playerId: string): Promise<ChallengeInterface[]> {
    return await this.challengeModel
      .find({ players: { $all: [playerId] } })
      .populate('requester')
      .populate('players')
      .populate('match')
      .exec();
  }

  async create(dto: createChallengeDTO): Promise<ChallengeInterface> {
    const { requester, players } = dto;

    let playersFound = [];

    if (!players.find((p) => p._id === requester)) {
      throw new BadRequestException(
        'The requester player is not included in the challenge',
      );
    }

    for (const { _id } of players) {
      playersFound = [
        ...playersFound,
        await this.playersService.getPlayerById(_id),
      ];
    }

    const categoryFound = await this.categoriesService.getCategoryByPlayer(
      requester,
    );

    if (!categoryFound) {
      throw new BadRequestException(
        'The requester has not been added to any category',
      );
    }

    const challenge = {
      ...dto,
      category: categoryFound.category,
      dateTimeRequest: new Date(),
      status: ChallengeStatus.PENDING,
    };

    const newChallenge = new this.challengeModel(challenge);
    return await newChallenge.save();
  }

  async updateChallenge(
    challengeId: string,
    dto: updateChallengeDTO,
  ): Promise<void> {
    const challengeFound = await this.getChallengeById(challengeId);

    /**
     * add Date and Time for Response when updating status
     */
    if (dto.status) {
      challengeFound.dateTimeReply = new Date();
    }

    Object.assign(challengeFound, dto);

    return await this.update(challengeFound.id, challengeFound);
  }

  async deleteChallenge(challengeId: string) {
    const challengeFound = await this.getChallengeById(challengeId);

    await this.delete(challengeFound.id);
  }

  async addMatchToChallenge(
    challengeId: string,
    { winner, result }: addMatchToChallengeDTO,
  ): Promise<void> {
    const challengeFound = await this.getChallengeById(challengeId);

    if (!challengeFound.players.find((playerId) => playerId == winner)) {
      throw new BadRequestException(
        `The winner player ${winner} doesn't belong to the challenge ${challengeId}`,
      );
    }

    if (challengeFound.match.winner) {
      throw new BadRequestException(
        `Challenge ${challengeId} already has a match registered. If you want to update info, use the correct endpoint.`,
      );
    }

    const match = {
      category: challengeFound.category,
      winner,
      result,
      players: challengeFound.players,
    };
  
    const newMatch = new this.matchModel(match);
    const matchSaved = await newMatch.save();

    challengeFound.status = ChallengeStatus.FINISHED;
    challengeFound.match = matchSaved._id;
    await challengeFound.save().catch(async (error) => {
      this.logger.error(error);
      /**
       * If for any reason the update of challenge fails
       * it is needed to delete the match
       */
      await this.matchModel.deleteOne({ _id: matchSaved._id }).exec();
      throw new InternalServerErrorException();
    });
  }

  private async update(
    id: string,
    data: ChallengeInterface | { status: ChallengeStatus },
  ): Promise<void> {
    this.logger.log(`data to update: ${JSON.stringify(data, null, 2)}`);
    await this.challengeModel.findByIdAndUpdate(id, { $set: data }).exec();
  }

  private async delete(id: string): Promise<void> {
    await this.update(id, { status: ChallengeStatus.CANCELLED });
  }

  private async getChallengeById(
    challengeId: string,
  ): Promise<ChallengeInterface> {
    const challengeFound = await this.challengeModel
      .findById(challengeId)
      .exec();

    if (!challengeFound) {
      throw new NotFoundException(
        `This challenge ${challengeId} cannot be found.`,
      );
    }

    return challengeFound;
  }
}
