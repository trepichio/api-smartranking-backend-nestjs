import * as mongoose from 'mongoose';

export const ChallengeSchema = new mongoose.Schema(
  {
    dateTimeChallenge: {
      type: Date,
    },
    status: {
      type: String,
    },
    dateTimeRequest: {
      type: Date,
    },
    dateTimeReply: {
      type: Date,
    },
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player',
    },
    category: { type: String },
    players: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player',
      },
    ],
    match: {
      winner: { type: String },
      result: [
        {
          set: {
            type: String,
          },
        },
      ],
      players: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Player',
        },
      ],
    },
  },
  {
    timestamps: true,
    collection: 'challenges',
  },
);
