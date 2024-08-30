import { Expose } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

export class GetCharacterOverallDto {
  @Expose()
  @IsOptional()
  @IsBoolean()
  update?: boolean;
}
