/*
model Equipment {
  id                        Int       @id @default(autoincrement())
  characterId               Int
  character                 Character @relation(fields: [characterId], references: [id])
  equipmentPart             String
  equipmentSlot             String
  itemName                  String
  itemIcon                  String
  itemDescription           String?
  itemShapeName             String
  itemShapeIcon             String
  itemGender                String?
  totalOptions              String
  baseOptions               String
  potentialOptionGrade      String
  additionalPotentialOption String
  exceptionalOptions        String
  addOptions                String
  growthExp                 Int
  growthLevel               Int
  scrollUpgrade             Int
  cuttableCount             Int
  goldenHammerFlag          String
  scrollResilienceCount     Int
  scrollUpgradeableCount    Int
  soulName                  String?
  soulOption                String?
  starforce                 Int
  starforceScrollFlag       String
  titleName                 String?
  titleIcon                 String?
  titleDescription          String?
  dateExpire                DateTime?
  dateOptionExpire          DateTime?
}
*/

import { Expose } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CharacterItemEquipmentDTO {
  @Expose()
  @IsString()
  equipmentPart: string;

  @Expose()
  @IsString()
  equipmentSlot: string;

  @Expose()
  @IsString()
  itemName: string;

  @Expose()
  @IsString()
  itemIcon: string;

  @Expose()
  @IsOptional()
  @IsString()
  itemDescription?: string;

  @Expose()
  @IsString()
  itemShapeName: string;

  @Expose()
  @IsString()
  itemShapeIcon: string;

  @Expose()
  @IsOptional()
  @IsString()
  itemGender?: string;

  @Expose()
  @IsString()
  totalOptions: string;

  @Expose()
  @IsString()
  baseOptions: string;

  @Expose()
  @IsString()
  potentialOptionGrade: string;

  @Expose()
  @IsString()
  additionalPotentialOption: string;

  @Expose()
  @IsString()
  exceptionalOptions: string;

  @Expose()
  @IsString()
  addOptions: string;

  @Expose()
  @IsString()
  growthExp: string;

  @Expose()
  @IsString()
  growthLevel: string;

  @Expose()
  @IsString()
  scrollUpgrade: string;

  @Expose()
  @IsString()
  cuttableCount: string;

  @Expose()
  @IsString()
  goldenHammerFlag: string;

  @Expose()
  @IsString()
  scrollResilienceCount: string;

  @Expose()
  @IsString()
  scrollUpgradeableCount: string;

  @Expose()
  @IsOptional()
  @IsString()
  soulName?: string;

  @Expose()
  @IsOptional()
  @IsString()
  soulOption?: string;

  @Expose()
  @IsString()
  starforce: string;

  @Expose()
  @IsString()
  starforceScrollFlag: string;

  @Expose()
  @IsOptional()
  @IsString()
  titleName?: string;

  @Expose()
  @IsOptional()
  @IsString()
  titleIcon?: string;

  @Expose()
  @IsOptional()
  @IsString()
  titleDescription?: string;

  @Expose()
  @IsOptional()
  @IsString()
  dateExpire?: string;

  @Expose()
  @IsOptional()
  @IsString()
  dateOptionExpire?: string;

  @Expose()
  @IsBoolean()
  active: boolean;
}
