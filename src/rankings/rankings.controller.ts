import { Controller, Get, Logger, Query } from '@nestjs/common';
import { RankingsService } from './rankings.service';

@Controller('api/v1/rankings')
export class RankingsController {
  private readonly logger = new Logger(RankingsController.name);

  constructor(private readonly rankingsService: RankingsService) {}

  @Get()
  async getRanking(
    @Query('category') category: string,
    @Query('dateRef') dateRef = '',
  ): Promise<any> {
    this.logger.log('getRanking');

    return await this.rankingsService.getRankings(category, dateRef);
  }
}
