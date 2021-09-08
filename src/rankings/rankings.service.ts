import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoryInterface } from 'src/categories/interfaces/category.interface';
import { EventName } from 'src/categories/interfaces/event.enum';
import { ChallengeInterface } from 'src/challenges/interfaces/challenge.interface';
import { MatchInterface } from 'src/challenges/interfaces/match.interface';
import { CategoriesService } from '../categories/categories.service';
import { RankingResponseInterface } from './interfaces/ranking-response.interface';
import { Ranking } from './interfaces/ranking.schema';

@Injectable()
export class RankingsService {
  private readonly logger = new Logger(RankingsService.name);

  constructor(
    private readonly categoriesService: CategoriesService,
    @InjectModel('Ranking') private readonly rankingModel: Model<Ranking>,
  ) {}

  async processMatch(
    challenge: ChallengeInterface,
    match: MatchInterface,
  ): Promise<void> {
    this.logger.log(`Processing match ${match._id}`);
    this.logger.log(`Match: ${JSON.stringify(match, null, 2)}`);

    try {
      const category: CategoryInterface =
        await this.categoriesService.getCategory(match.category);

      await Promise.all(
        match.players.map((player) => {
          const ranking: Ranking = new this.rankingModel();

          ranking.category = category._id;
          ranking.challenge = challenge._id;
          ranking.match = match._id;
          ranking.player = player._id;

          /**
           * set the date of the match;
           */
          ranking.dateTimeChallenge = challenge.dateTimeChallenge;

          const event =
            player.toJSON() === match.winner.toJSON()
              ? category.events.find(
                  (event) => event.name === EventName.VICTORY,
                )
              : category.events.find(
                  (event) => event.name === EventName.DEFEAT,
                );

          ranking.event = event.name;
          ranking.score = event.value;
          ranking.operation = event.operation;

          this.logger.log(`Adding ranking ${JSON.stringify(ranking, null, 2)}`);

          ranking.save();
        }),
      );
    } catch (error) {
      this.logger.error(`error: ${error}`);
      throw new InternalServerErrorException(error.message);
    }
  }

  async getRankings(
    categoryId: string,
    dateRef: string,
  ): Promise<RankingResponseInterface[] | RankingResponseInterface> {
    this.logger.log(
      `Getting rankings for ${categoryId} and dateRef: ${dateRef}`,
    );

    try {
      /**
       * If not provided it should be the current date
       */
      if (!dateRef) {
        dateRef = new Date().toLocaleDateString();
        this.logger.log(`dateRef: ${dateRef}`);
      }

      /**
       * Get processed matches filtered by category
       */
      const rankings: Ranking[] = await this.rankingModel
        .find({
          category: categoryId,
          dateTimeChallenge: { $lte: new Date(`${dateRef} 23:59:59.999`) },
        })
        .exec();

      const responses = rankings.reduce((rankings, ranking) => {
        /**
         * Group the rankings by player
         * and summarize the score and events (matches history)
         */
        if (!rankings[ranking.player]) {
          rankings[ranking.player] = {} as RankingResponseInterface;
          rankings[ranking.player].player = ranking.player;
          rankings[ranking.player].score = 0;
          rankings[ranking.player].matchesHistory = {
            wins: 0,
            losses: 0,
            matches: 0,
          };
        }

        rankings[ranking.player].score += parseInt(
          `${ranking.operation}${ranking.score}`,
        );
        rankings[ranking.player].matchesHistory.wins +=
          ranking.event === EventName.VICTORY ? 1 : 0;
        rankings[ranking.player].matchesHistory.losses +=
          ranking.event === EventName.DEFEAT ? 1 : 0;
        rankings[ranking.player].matchesHistory.matches += 1;

        return rankings;
      }, {});

      const rankingsResponses: RankingResponseInterface[] =
        Object.values(responses);

      /**
       * Sort the player's rankings by score
       * and add the rank for each player
       */
      return rankingsResponses
        .sort((a, b) => b.score - a.score)
        .map((response) => ({
          ...response,
          rank: rankingsResponses.indexOf(response) + 1,
        }));
    } catch (error) {
      this.logger.error(`error: ${error}`);
      throw new InternalServerErrorException(error.message);
    }
  }
}
