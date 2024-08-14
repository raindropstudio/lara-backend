import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class GetCharacterOverallDto {
  @IsOptional()
  @IsString()
  date?: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  update?: boolean;
}
