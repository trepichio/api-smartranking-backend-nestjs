import * as mongoose from 'mongoose';

export const PlayerSchema = new mongoose.Schema(
  {
    mobileNumber: {
      type: Number,
    },
    email: {
      type: String,
      unique: true,
    },
    name: {
      type: String,
    },
    ranking: {
      type: String,
    },
    rankingPosition: {
      type: Number,
    },
    urlProfilePicture: {
      type: String,
    },
  },
  {
    timestamps: true,
    collection: 'players',
  },
);
