import { Expose, Type } from 'class-transformer';
import { AbilityDto } from './ability.dto';
import { CashEquipmentPresetDto } from './cash-equipment.dto';
import { CharacterBasicDto } from './character-basic.dto';
import { HexaStatDto } from './hexa-stat.dto';
import { HyperStatPresetDto } from './hyper-stat.dto';
import { ItemEquipmentPresetDto } from './item-equipment.dto';
import { CharacterLinkSkillDto } from './link-skill.dto';
import { PetEquipmentDataDto } from './pet-equipment.dto';
import { PropensityDto } from './propensity.dto';
import { SetEffectDto } from './set-effect.dto';
import { CharacterSkillCoreDto } from './skill-core.dto';
import { CharacterSkillDto } from './skill.dto';
import { StatDto } from './stat.dto';
import { SymbolDto } from './symbol.dto';
import { UnionDto } from './union.dto';

export class CharacterDto extends CharacterBasicDto {
  @Expose()
  @Type(() => StatDto)
  stat?: StatDto;

  @Expose()
  @Type(() => HyperStatPresetDto)
  hyperStatPreset: HyperStatPresetDto[];

  @Expose()
  @Type(() => PropensityDto)
  propensity: PropensityDto;

  @Expose()
  @Type(() => AbilityDto)
  ability: AbilityDto;

  @Expose()
  @Type(() => ItemEquipmentPresetDto)
  itemEquipmentPreset: ItemEquipmentPresetDto[];

  @Expose()
  @Type(() => CashEquipmentPresetDto)
  cashEquipmentPreset: CashEquipmentPresetDto[];

  @Expose()
  @Type(() => UnionDto)
  union: UnionDto;

  @Expose()
  @Type(() => SetEffectDto)
  setEffect: SetEffectDto[];

  @Expose()
  @Type(() => PetEquipmentDataDto)
  petEquipment: PetEquipmentDataDto[];

  @Expose()
  @Type(() => SymbolDto)
  symbol: SymbolDto[];

  @Expose()
  @Type(() => CharacterSkillDto)
  skill: CharacterSkillDto[];

  @Expose()
  @Type(() => CharacterLinkSkillDto)
  linkSkill: CharacterLinkSkillDto[];

  @Expose()
  @Type(() => CharacterSkillCoreDto)
  skillCore: CharacterSkillCoreDto[];

  @Expose()
  @Type(() => HexaStatDto)
  hexaStat: HexaStatDto[];
}
