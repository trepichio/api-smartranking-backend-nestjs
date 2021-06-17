import { IsDateString, IsEnum, IsNotIn, IsOptional } from 'class-validator';
import { Date } from 'mongoose';
import { ChallengeStatus } from '../interfaces/challengeStatus.enum';
import { Transform } from 'class-transformer';

export class updateChallengeDTO {
  @IsOptional()
  @IsDateString()
  dateTimeChallenge: Date;

  @IsOptional()
  @Transform(({ value }) => value.toUpperCase())
  @IsEnum(ChallengeStatus)
  @IsNotIn([ChallengeStatus.PENDING])
  status: ChallengeStatus;
}
