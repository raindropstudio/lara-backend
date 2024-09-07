import { Expose, Type } from 'class-transformer';

export class ItemOptionDto {
  hash: string;

  @Expose()
  str?: number;

  @Expose()
  dex?: number;

  @Expose()
  int?: number;

  @Expose()
  luk?: number;

  @Expose()
  maxHp?: number;

  @Expose()
  maxMp?: number;

  @Expose()
  attackPower?: number;

  @Expose()
  magicPower?: number;

  @Expose()
  armor?: number;

  @Expose()
  speed?: number;

  @Expose()
  jump?: number;

  @Expose()
  bossDamage?: number;

  @Expose()
  ignoreMonsterArmor?: number;

  @Expose()
  allStat?: number;

  @Expose()
  damage?: number;

  @Expose()
  equipmentLevelDecrease?: number;

  @Expose()
  maxHpRate?: number;

  @Expose()
  maxMpRate?: number;

  @Expose()
  baseEquipmentLevel?: number;

  @Expose()
  exceptionalUpgrade?: number;
}

export class ItemEquipmentInfoDto {
  hash: string;

  @Expose()
  part: string;

  @Expose()
  slot: string;

  @Expose()
  name: string;

  @Expose()
  icon: string;

  @Expose()
  description?: string;

  @Expose()
  shapeName?: string;

  @Expose()
  shapeIcon?: string;

  @Expose()
  gender?: string;

  @Expose()
  potentialOptionGrade?: 'RARE' | 'EPIC' | 'UNIQUE' | 'LEGENDARY';

  @Expose()
  additionalPotentialOptionGrade?: 'RARE' | 'EPIC' | 'UNIQUE' | 'LEGENDARY';

  @Expose()
  potentialOption?: string[];

  @Expose()
  additionalPotentialOption?: string[];

  @Expose()
  equipmentLevelIncrease?: number;

  @Expose()
  growthExp?: number;

  @Expose()
  growthLevel?: number;

  @Expose()
  scrollUpgrade?: number;

  @Expose()
  cuttableCount?: number;

  @Expose()
  goldenHammerFlag?: boolean;

  @Expose()
  scrollResilienceCount?: number;

  @Expose()
  scrollUpgradeableCount?: number;

  @Expose()
  soulName?: string;

  @Expose()
  soulOption?: string;

  @Expose()
  starforce?: number;

  @Expose()
  starforceScrollFlag?: boolean;

  @Expose()
  specialRingLevel?: number;

  @Expose()
  dateExpire?: Date;

  @Expose()
  dateOptionExpire?: Date;

  @Expose()
  @Type(() => ItemOptionDto)
  totalOption?: ItemOptionDto;

  @Expose()
  @Type(() => ItemOptionDto)
  baseOption?: ItemOptionDto;

  @Expose()
  @Type(() => ItemOptionDto)
  exceptionalOption?: ItemOptionDto;

  @Expose()
  @Type(() => ItemOptionDto)
  addOption?: ItemOptionDto;

  @Expose()
  @Type(() => ItemOptionDto)
  etcOption?: ItemOptionDto;

  @Expose()
  @Type(() => ItemOptionDto)
  starforceOption?: ItemOptionDto;
}

export class ItemEquipmentPresetDto {
  @Expose()
  @Type(() => ItemEquipmentInfoDto)
  itemEquipmentInfo: ItemEquipmentInfoDto[];

  @Expose()
  presetNo: number;

  @Expose()
  active: boolean;
}
