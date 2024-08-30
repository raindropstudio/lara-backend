import { Optional } from '@nestjs/common';
import { Expose, Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsString, ValidateNested } from 'class-validator';

export class CharacterAbilityDTO {
  @Expose()
  @ValidateNested({ each: true })
  @Type(() => AbilityDTO)
  abilityInfo: AbilityDTO[];

  @Expose()
  @IsNumber()
  presetNo: number;

  @Expose()
  @IsBoolean()
  @Optional()
  active: boolean;
}

export class AbilityDTO {
  @Expose()
  @IsString()
  abilityGrade: 'EPIC' | 'UNIQUE' | 'LEGENDARY';

  @Expose()
  @IsNumber()
  @Optional()
  abilityNo: number;

  @Expose()
  @IsString()
  abilityValue: string;
}
