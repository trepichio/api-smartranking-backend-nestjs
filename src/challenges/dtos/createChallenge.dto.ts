import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsNotEmpty,
} from 'class-validator';
import { Date } from 'mongoose';
import { PlayerInterface } from 'src/players/interfaces/player.interface';

export class createChallengeDTO {
  @IsNotEmpty()
  @IsDateString()
  dateTimeChallenge: Date;

  @IsNotEmpty()
  requester: PlayerInterface;

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  players: Array<PlayerInterface>;
}
