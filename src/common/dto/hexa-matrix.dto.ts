import { Expose, Type } from 'class-transformer';

export class HexaCoreSkillDto {
  @Expose()
  skillName: string;

  @Expose()
  description: string;

  @Expose()
  skillIcon: string | null;

  @Expose()
  currentEffect: string | null;

  @Expose()
  nextEffect: string | null;
}

export class HexaCoreDto {
  @Expose()
  coreName: string;

  @Expose()
  coreLevel: number;

  @Expose()
  coreType: 'SKILL_CORE' | 'ENHANCEMENT_CORE' | 'COMMON_CORE' | 'MASTERY_CORE';
  @Expose()
  @Type(() => HexaCoreSkillDto)
  skills: HexaCoreSkillDto[];
}

export class HexaMatrixDto {
  @Expose()
  date: string | null;

  @Expose()
  characterClass: string;

  @Expose()
  @Type(() => HexaCoreDto)
  cores: HexaCoreDto[];
}
