import { Expose, Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

export class CharacterHyperStatDTO {
  @Expose()
  @ValidateNested({ each: true })
  @Type(() => HyperStatDTO)
  hyperStat: HyperStatDTO[];

  @Expose()
  @IsOptional()
  @IsNumber()
  presetNo?: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  active?: boolean;
}

export class HyperStatDTO {
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
}
