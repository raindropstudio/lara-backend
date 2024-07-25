import { Expose } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class CharacterStatDTO {
  @Expose()
  @IsString()
  statName: string;

  @Expose()
  @IsNumber()
  statValue: number | null;
}
