import { Transform, Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { EventInterface } from '../interfaces/event.interface';

export class createCategoryDTO {
  @IsString()
  @IsNotEmpty()
  readonly category: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => Event)
  @Transform(({ value }): EventInterface[] =>
    value.map((event) =>
      Object.assign(event, {
        name: event.name.toUpperCase(),
      }),
    ),
  )
  events: Array<EventInterface>;
}

class Event {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEnum(['+', '-'])
  operation: string;

  @IsNotEmpty()
  @IsNumber()
  value: number;
}
