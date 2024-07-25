import { Expose } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class CharacterPropensityDTO {
  @Expose()
  @IsNumber()
  charismaLevel: number;

  @Expose()
  @IsNumber()
  sensibilityLevel: number;

  @Expose()
  @IsNumber()
  insightLevel: number;

  @Expose()
  @IsNumber()
  willingnessLevel: number;

  @Expose()
  @IsNumber()
  handicraftLevel: number;

  @Expose()
  @IsNumber()
  charmLevel: number;
}
