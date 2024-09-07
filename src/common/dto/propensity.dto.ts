import { Expose } from 'class-transformer';

export class PropensityDto {
  @Expose()
  charismaLevel: number;

  @Expose()
  sensibilityLevel: number;

  @Expose()
  insightLevel: number;

  @Expose()
  willingnessLevel: number;

  @Expose()
  handicraftLevel: number;

  @Expose()
  charmLevel: number;
}
