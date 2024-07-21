import { Expose } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class GetCharacterOverallDto {
  @Expose()
  @IsOptional()
  @IsString()
  date?: string;

  @Expose()
  @IsOptional()
  @IsBoolean()
  update?: boolean;
}
