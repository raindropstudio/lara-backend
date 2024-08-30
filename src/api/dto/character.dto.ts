import { Expose, Transform, Type } from 'class-transformer';
import { IsBoolean, IsDate, IsInt, IsNumber, IsString, ValidateNested } from 'class-validator';
import { CharacterAbilityDTO } from './character-ability.dto';
import { CharacterHyperStatDTO } from './character-hyper-stat.dto';
import { CharacterItemEquipmentDTO } from './character-item-equipment.dto';
import { CharacterPropensityDTO } from './character-propensity.dto';
import { CharacterStatDTO } from './character-stat.dto';

export class CharacterDTO {
  constructor(partial: Partial<CharacterDTO>) {
    Object.assign(this, partial);
  }

  @Expose()
  @IsString()
  nickname: string;

  @Expose()
  @IsString()
  worldName: string;

  @Expose()
  @IsString()
  gender: string;

  @Expose()
  @IsString()
  class: string;

  @Expose()
  @IsString()
  classLevel: string;

  @Expose()
  @IsInt()
  level: number;

  @Expose()
  @Transform(({ value }) => value.toString())
  @IsString()
  exp: bigint;

  @Expose()
  @IsNumber()
  expRate: number;

  @Expose()
  @IsString()
  guildName: string;

  @Expose()
  @IsString()
  imageUrl: string;

  @Expose()
  @IsDate()
  dateCreate: Date;

  @Expose()
  @IsBoolean()
  accessFlag: boolean;

  @Expose()
  @IsBoolean()
  liberationQuestClear: boolean;

  @Expose()
  @IsInt()
  popularity: number;

  @Expose()
  @IsDate()
  updatedAt: Date;

  @Expose()
  @ValidateNested({ each: true })
  @Type(() => CharacterStatDTO)
  stat: CharacterStatDTO;

  @Expose()
  @ValidateNested({ each: true })
  @Type(() => CharacterHyperStatDTO)
  hyperStat: CharacterHyperStatDTO[];

  @Expose()
  @ValidateNested({ each: true })
  @Type(() => CharacterPropensityDTO)
  propensity: CharacterPropensityDTO;

  @Expose()
  @ValidateNested({ each: true })
  @Type(() => CharacterAbilityDTO)
  ability: CharacterAbilityDTO[];

  @Expose()
  @ValidateNested({ each: true })
  @Type(() => CharacterItemEquipmentDTO)
  itemEquipment: CharacterItemEquipmentDTO[];
}
