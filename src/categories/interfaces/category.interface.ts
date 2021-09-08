import { Document } from 'mongoose';
import { PlayerInterface } from 'src/players/interfaces/player.interface';
import { EventInterface } from './event.interface';

export interface CategoryInterface extends Document {
  readonly category: string;
  description: string;
  events: Array<EventInterface>;
  players: Array<PlayerInterface>;
}
