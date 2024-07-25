import { Expose } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CharacterHyperStatDTO {
  @Expose()
  @IsString()
  statType: string;

  @Expose()
  @IsNumber()
  statPoint: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  statLevel?: number;

  @Expose()
  @IsOptional()
  @IsString()
  statIncrease?: string;

  @Expose()
  @IsOptional()
  @IsNumber()
  preset?: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  active?: boolean;
}
