import { Expose, Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsString, ValidateNested } from 'class-validator';

export class CharacterAbilityDTO {
  @Expose()
  @ValidateNested({ each: true })
  @Type(() => AbilityPresetDTO)
  preset: AbilityPresetDTO[];

  @Expose()
  @IsNumber()
  remainFame: number;
}

export class AbilityPresetDTO {
  @Expose()
  @ValidateNested({ each: true })
  @Type(() => AbilityInfoDTO)
  abilityInfo: AbilityInfoDTO[];

  @Expose()
  @IsNumber()
  presetNo: number;

  @Expose()
  @IsBoolean()
  active: boolean;
}

export class AbilityInfoDTO {
  @Expose()
  @IsString()
  abilityGrade: 'RARE' | 'EPIC' | 'UNIQUE' | 'LEGENDARY' | 'REMAIN_FAME';

  @Expose()
  @IsNumber()
  abilityNo: number;

  @Expose()
  @IsString()
  abilityValue: string;
}
