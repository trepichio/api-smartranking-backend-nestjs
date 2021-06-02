import { IsEmail, IsNotEmpty } from 'class-validator';

export class updatePlayerDTO {
  @IsNotEmpty()
  readonly mobileNumber: string;

  @IsNotEmpty()
  readonly name: string;
}
