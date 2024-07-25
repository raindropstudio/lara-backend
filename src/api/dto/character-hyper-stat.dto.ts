import { Expose } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CharacterHyperStatDTO {
  @Expose()
  @IsString()
  statType: string;

  @Expose()
  @IsOptional()
  @IsNumber()
  statPoint: number;

  @Expose()
  @IsNumber()
  statLevel: number;

  @Expose()
  @IsOptional()
  @IsString()
  statIncrease: string;

  @Expose()
  @IsNumber()
  preset: number;

  @Expose()
  @IsNumber()
  active: boolean;
}
