import { Expose, Type } from 'class-transformer';

export class AbilityDto {
  @Expose()
  @Type(() => AbilityPresetDto)
  preset: AbilityPresetDto[];

  @Expose()
  remainFame: number;
}

export class AbilityPresetDto {
  @Expose()
  @Type(() => AbilityInfoDto)
  abilityInfo: AbilityInfoDto[];

  @Expose()
  presetNo: number;

  @Expose()
  active: boolean;
}

export class AbilityInfoDto {
  @Expose()
  abilityGrade: 'RARE' | 'EPIC' | 'UNIQUE' | 'LEGENDARY';

  @Expose()
  abilityNo: number;

  @Expose()
  abilityValue: string;
}
