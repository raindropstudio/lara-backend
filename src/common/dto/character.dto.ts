import { Expose, Type } from 'class-transformer';
import { AbilityDto } from './ability.dto';
import { CashEquipmentPresetDto } from './cash-equipment.dto';
import { CharacterBasicDto } from './character-basic.dto';
import { HyperStatPresetDto } from './hyper-stat.dto';
import { ItemEquipmentPresetDto } from './item-equipment.dto';
import { PropensityDto } from './propensity.dto';
import { StatDto } from './stat.dto';
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
}
