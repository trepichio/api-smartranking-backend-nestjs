import { Document } from 'mongoose';
import { PlayerInterface } from 'src/players/interfaces/player.interface';
import { ChallengeStatus } from './challengeStatus.enum';

export interface ChallengeInterface extends Document {
  dateTimeChallenge: Date;
  status: ChallengeStatus;
  dateTimeRequest: Date;
  dateTimeReply: Date;
  requester: PlayerInterface;
  category: string;
  players: Array<PlayerInterface>;
  match: MatchInterface;
}

export interface MatchInterface extends Document {
  category: string;
  def: PlayerInterface;
  result: Array<ResultInterface>;
  players: Array<PlayerInterface>;
}

export interface ResultInterface {
  set: string;
}
