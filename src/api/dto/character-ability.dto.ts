import { Expose } from 'class-transformer';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class CharacterAbilityDTO {
  @Expose()
  @IsString()
  abilityGrade: string;

  @Expose()
  @IsNumber()
  abilityNo: number;

  @Expose()
  @IsString()
  abilityValue: string;

  @Expose()
  @IsNumber()
  remainFame: number;

  @Expose()
  @IsNumber()
  presetNo: number;

  @Expose()
  @IsBoolean()
  active: boolean;
}
