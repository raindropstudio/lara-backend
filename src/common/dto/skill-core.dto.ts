import { Expose, Type } from 'class-transformer';

export class SkillCoreDto {
  hash: string;

  @Expose()
  grade: number;

  @Expose()
  coreName: string;

  @Expose()
  coreType: string;

  @Expose()
  coreSkill: string[];
}

export class CharacterSkillCoreDto {
  @Expose()
  @Type(() => SkillCoreDto)
  skillCore: SkillCoreDto;

  @Expose()
  slotId?: number | null;

  @Expose()
  slotLevel?: number | null;

  @Expose()
  coreLevel: number;
}
