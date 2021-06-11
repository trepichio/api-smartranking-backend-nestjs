import { IsDateString, IsEnum, IsNotEmpty, IsNotIn } from 'class-validator';
import { Date } from 'mongoose';
import { ChallengeStatus } from '../interfaces/challengeStatus.enum';

export class updateChallengeDTO {
  @IsNotEmpty()
  @IsDateString()
  dateTimeChallenge: Date;

  @IsNotEmpty()
  @IsEnum(ChallengeStatus)
  @IsNotIn([ChallengeStatus.PENDING])
  status: ChallengeStatus;
}
