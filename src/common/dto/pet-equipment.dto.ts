import { Expose, Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

// 펫 장비 정보 DTO
export class PetEquipmentInfoDto {
  @Expose()
  @IsString()
  itemName: string;

  @Expose()
  @IsString()
  itemIcon: string;

  @Expose()
  @IsString()
  itemDescription: string;

  @Expose()
  @IsNumber()
  scrollUpgrade: number;

  @Expose()
  @IsNumber()
  scrollUpgradable: number;

  @Expose()
  @IsString()
  itemShape: string;

  @Expose()
  @IsString()
  itemShapeIcon: string;

  @Expose()
  @IsOptional()
  @IsNumber()
  attackPower: number | null;

  @Expose()
  @IsOptional()
  @IsNumber()
  magicPower: number | null;
}

// 펫 자동 스킬 DTO
export class PetAutoSkillDto {
  @Expose()
  @IsString()
  skill1: string;

  @Expose()
  @IsString()
  skill1Icon: string;

  @Expose()
  @IsOptional()
  @IsString()
  skill2?: string;

  @Expose()
  @IsOptional()
  @IsString()
  skill2Icon?: string;
}

// 펫 개별 정보 DTO
export class PetInfoDto {
  @Expose()
  @IsString()
  petName: string;

  @Expose()
  @IsString()
  petNickname: string;

  @Expose()
  @IsString()
  petIcon: string;

  @Expose()
  @IsString()
  petDescription: string;

  @Expose()
  @ValidateNested()
  @Type(() => PetEquipmentInfoDto)
  petEquipment: PetEquipmentInfoDto;

  @Expose()
  @IsOptional()
  @ValidateNested()
  @Type(() => PetAutoSkillDto)
  petAutoSkill?: PetAutoSkillDto;

  @Expose()
  @IsString()
  petType: string;

  @Expose()
  @IsArray()
  @IsString({ each: true })
  petSkills: string[];

  @Expose()
  @IsOptional()
  petDateExpire: string;

  @Expose()
  @IsString()
  petAppearance: string;

  @Expose()
  @IsString()
  petAppearanceIcon: string;
}

// 전체 펫 정보 DTO
export class PetEquipmentDataDto {
  @Expose()
  @IsNumber()
  petNo: number;

  @Expose()
  @ValidateNested()
  @Type(() => PetInfoDto)
  petInfo: PetInfoDto;
}
