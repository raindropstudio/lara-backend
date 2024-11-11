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
  coreType: '스킬 코어' | '강화 코어' | '공용 코어' | '마스터리 코어';
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
