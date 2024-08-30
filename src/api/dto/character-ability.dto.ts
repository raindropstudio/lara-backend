import { Expose, Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsString, ValidateNested } from 'class-validator';

export class CharacterAbilityDTO {
  @Expose()
  @ValidateNested({ each: true })
  @Type(() => AbilityDTO)
  ability: AbilityDTO[];

  @Expose()
  @IsNumber()
  presetNo: number;

  @Expose()
  @IsBoolean()
  active: boolean;
}

export class AbilityDTO {
  @Expose()
  @IsString()
  abilityGrade: 'RARE' | 'EPIC' | 'UNIQUE' | 'LEGENDARY';

  @Expose()
  @IsNumber()
  abilityNo: number;

  @Expose()
  @IsString()
  abilityValue: string;
}
