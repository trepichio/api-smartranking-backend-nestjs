import { Document } from 'mongoose';
import { PlayerInterface } from 'src/players/interfaces/player.interface';

export interface MatchInterface extends Document {
  winner: PlayerInterface;
  result: Array<ResultInterface>;
  players: Array<PlayerInterface>;
  category: string;
}

export interface ResultInterface {
  set: string;
}
