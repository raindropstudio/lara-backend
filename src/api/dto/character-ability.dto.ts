import { Optional } from '@nestjs/common';
import { Expose } from 'class-transformer';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class CharacterAbilityDTO {
  @Expose()
  @IsString()
  abilityGrade: string;

  @Expose()
  @IsNumber()
  @Optional()
  abilityNo: number;

  @Expose()
  @IsString()
  abilityValue: string;

  @Expose()
  @IsNumber()
  presetNo: number;

  @Expose()
  @IsBoolean()
  @Optional()
  active: boolean;
}
