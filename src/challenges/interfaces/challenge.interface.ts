import { Document } from 'mongoose';
import { MatchInterface } from 'src/challenges/interfaces/match.interface';
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
