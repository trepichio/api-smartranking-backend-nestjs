import { Transform, Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { EventInterface } from '../interfaces/event.interface';

export class updateCategoryDTO {
  @IsString()
  @IsOptional()
  description: string;

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
