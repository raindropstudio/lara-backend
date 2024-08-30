import { Expose, Type } from 'class-transformer';
import { IsArray, IsBoolean, IsDate, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

export class CharacterItemEquipmentDTO {
  @Expose()
  @ValidateNested({ each: true })
  itemEquipment: ItemEquipmentDTO[];

  @Expose()
  @IsNumber()
  presetNo: number;

  @Expose()
  @IsBoolean()
  active: boolean;
}

export class ItemEquipmentDTO {
  @Expose()
  @IsString()
  part: string;

  @Expose()
  @IsString()
  slot: string;

  @Expose()
  @IsString()
  name: string;

  @Expose()
  @IsString()
  icon: string;

  @Expose()
  @IsOptional()
  @IsString()
  description?: string;

  @Expose()
  @IsString()
  shapeName: string;

  @Expose()
  @IsString()
  shapeIcon: string;

  @Expose()
  @IsOptional()
  @IsString()
  gender?: string;

  @Expose()
  @IsString()
  potentialOptionGrade: 'RARE' | 'EPIC' | 'UNIQUE' | 'LEGENDARY';

  @Expose()
  @IsString()
  additionalPotentialOptionGrade: 'RARE' | 'EPIC' | 'UNIQUE' | 'LEGENDARY';

  @Expose()
  @IsArray()
  potentialOption: string[];

  @Expose()
  @IsArray()
  additionalPotentialOption: string[];

  @Expose()
  @IsNumber()
  equipmentLevelIncrease: number;

  @Expose()
  @IsNumber()
  growthExp: number;

  @Expose()
  @IsNumber()
  growthLevel: number;

  @Expose()
  @IsNumber()
  scrollUpgrade: number;

  @Expose()
  @IsNumber()
  cuttableCount: number;

  @Expose()
  @IsBoolean()
  goldenHammerFlag: boolean;

  @Expose()
  @IsNumber()
  scrollResilienceCount: number;

  @Expose()
  @IsNumber()
  scrollUpgradeableCount: number;

  @Expose()
  @IsOptional()
  @IsString()
  soulName?: string;

  @Expose()
  @IsOptional()
  @IsString()
  soulOption?: string;

  @Expose()
  @IsOptional()
  @IsNumber()
  starforce?: number;

  @Expose()
  @IsOptional()
  @IsBoolean()
  starforceScrollFlag?: boolean;

  @Expose()
  @IsOptional()
  @IsNumber()
  specialRingLevel?: number;

  @Expose()
  @IsOptional()
  @IsDate()
  dateExpire?: Date;

  @Expose()
  @IsOptional()
  @IsDate()
  dateOptionExpire?: Date;

  @Expose()
  @ValidateNested({ each: true })
  @Type(() => ItemOptionDTO)
  totalOption: ItemOptionDTO;

  @Expose()
  @ValidateNested({ each: true })
  @Type(() => ItemOptionDTO)
  baseOption: ItemOptionDTO;

  @Expose()
  @ValidateNested({ each: true })
  @Type(() => ItemOptionDTO)
  exceptionalOption: ItemOptionDTO;

  @Expose()
  @ValidateNested({ each: true })
  @Type(() => ItemOptionDTO)
  addOption: ItemOptionDTO;

  @Expose()
  @ValidateNested({ each: true })
  @Type(() => ItemOptionDTO)
  etcOption: ItemOptionDTO;

  @Expose()
  @ValidateNested({ each: true })
  @Type(() => ItemOptionDTO)
  starforceOption: ItemOptionDTO;
}

export class ItemOptionDTO {
  @Expose()
  @IsOptional()
  @IsNumber()
  str?: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  dex?: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  int?: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  luk?: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  maxHp?: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  maxMp?: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  attackPower?: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  magicPower?: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  armor?: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  speed?: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  jump?: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  bossDamage?: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  ignoreMonsterArmor?: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  allStat?: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  damage?: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  equipmentLevelDecrease?: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  maxHpRate?: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  maxMpRate?: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  baseEquipmentLevel?: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  exceptionalUpgrade?: number;
}
