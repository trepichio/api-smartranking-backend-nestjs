import * as mongoose from 'mongoose';

export const MatchSchema = new mongoose.Schema(
  {
    category: { type: 'string' },
    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player',
    },
    players: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player',
      },
    ],
    result: [
      {
        set: { type: 'string' },
      },
    ],
  },
  {
    timestamps: true,
    collection: 'matches',
  },
);
