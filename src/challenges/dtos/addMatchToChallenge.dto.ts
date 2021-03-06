import { IsNotEmpty } from 'class-validator';
import { PlayerInterface } from 'src/players/interfaces/player.interface';
import { ResultInterface } from '../interfaces/match.interface';

export class addMatchToChallengeDTO {
  @IsNotEmpty()
  winner: PlayerInterface;

  @IsNotEmpty()
  result: Array<ResultInterface>;
}
