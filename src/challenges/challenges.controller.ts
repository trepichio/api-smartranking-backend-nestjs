import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Logger,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ValidationParamsPipe } from 'src/common/pipes/validation-params';
import { addMatchToChallengeDTO } from 'src/challenges/dtos/addMatchToChallenge.dto';
import { ChallengesService } from './challenges.service';
import { createChallengeDTO } from './dtos/createChallenge.dto';
import { updateChallengeDTO } from './dtos/updateChallenge.dto';
import { ChallengeInterface } from './interfaces/challenge.interface';

@Controller('api/v1/challenges')
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  private readonly logger = new Logger(ChallengesController.name);
  @Get()
  async getAll(
    @Query('playerId') playerId: string,
  ): Promise<ChallengeInterface[]> {
    if (playerId) {
      return await this.challengesService.getAllByPlayerId(playerId);
    }
    return await this.challengesService.getAll();
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async create(@Body() dto: createChallengeDTO): Promise<ChallengeInterface> {
    this.logger.log(`createChallengeDTO: ${JSON.stringify(dto)}`);
    return await this.challengesService.create(dto);
  }

  @Put(':challengeId')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async update(
    @Param('challengeId', ValidationParamsPipe) challengeId: string,
    @Body() dto: updateChallengeDTO,
  ): Promise<void> {
    await this.challengesService.updateChallenge(challengeId, dto);
  }

  @Delete(':challengeId')
  async deleteOne(
    @Param('challengeId', ValidationParamsPipe) challengeId: string,
  ): Promise<void> {
    await this.challengesService.deleteChallenge(challengeId);
  }

  @Post(':challengeId/match')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async addMatch(
    @Param('challengeId', ValidationParamsPipe) challengeId: string,
    @Body() dto: addMatchToChallengeDTO,
  ): Promise<void> {
    await this.challengesService.addMatchToChallenge(challengeId, dto);
  }
}
