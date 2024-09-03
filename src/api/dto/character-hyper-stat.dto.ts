import { Expose, Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

export class CharacterHyperStatDTO {
  @Expose()
  @ValidateNested({ each: true })
  @Type(() => HyperStatDTO)
  hyperStatInfo: HyperStatDTO[];

  @Expose()
  @IsNumber()
  presetNo: number;

  @Expose()
  @IsNumber()
  active: boolean;

  @Expose()
  @IsNumber()
  remainPoint: number;
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
