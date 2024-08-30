export interface CharacterItemEquipment {
  id?: number;
  itemEquipment: ItemEquipment[];
  presetNo?: number;
  active?: boolean;
}

export interface ItemEquipment {
  id?: number;
  hash: string;
  part: string;
  slot: string;
  name: string;
  icon: string;
  description?: string;
  shapeName: string;
  shapeIcon: string;
  gender?: string;
  potentialOptionGrade: 'RARE' | 'EPIC' | 'UNIQUE' | 'LEGENDARY';
  additionalPotentialOptionGrade: 'RARE' | 'EPIC' | 'UNIQUE' | 'LEGENDARY';
  potentialOption: string[];
  additionalPotentialOption: string[];
  equipmentLevelIncrease: number;
  growthExp: number;
  growthLevel: number;
  scrollUpgrade: number;
  cuttableCount: number;
  goldenHammerFlag: boolean;
  scrollResilienceCount: number;
  scrollUpgradeableCount: number;
  soulName?: string;
  soulOption?: string;
  starforce?: number;
  starforceScrollFlag?: boolean;
  specialRingLevel?: number;
  dateExpire?: Date;
  dateOptionExpire?: Date;
  totalOption: ItemOption;
  baseOption: ItemOption;
  exceptionalOption: ItemOption;
  addOption: ItemOption;
  etcOption: ItemOption;
  starforceOption: ItemOption;
}

export interface ItemOption {
  id?: number;
  hash: string;
  str?: number;
  dex?: number;
  int?: number;
  luk?: number;
  maxHp?: number;
  maxMp?: number;
  attackPower?: number;
  magicPower?: number;
  armor?: number;
  speed?: number;
  jump?: number;
  bossDamage?: number;
  ignoreMonsterArmor?: number;
  allStat?: number;
  damage?: number;
  equipmentLevelDecrease?: number;
  maxHpRate?: number;
  maxMpRate?: number;
  baseEquipmentLevel?: number;
  exceptionalUpgrade?: number;
}
