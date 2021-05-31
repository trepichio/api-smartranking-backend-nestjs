import { Document } from 'mongoose';

export interface PlayerInterface extends Document {
  readonly mobileNumber: string;
  readonly email: string;
  name: string;
  ranking: string;
  rankingPosition: number;
  urlProfilePicture: string;
}
