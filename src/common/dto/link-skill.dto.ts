import { Expose, Type } from 'class-transformer';

export class LinkSkillDto {
  hash: string;

  @Expose()
  name: string;

  @Expose()
  description?: string;

  @Expose()
  level: number;

  @Expose()
  icon: string;

  @Expose()
  effect?: string;

  @Expose()
  effectNext?: string;
}

export class CharacterLinkSkillDto {
  @Expose()
  @Type(() => LinkSkillDto)
  ownedSkill: LinkSkillDto;

  @Expose()
  @Type(() => LinkSkillDto)
  skill: LinkSkillDto[];

  @Expose()
  presetNo: number; // 링크스킬은 항상 0번이 적용중 1, 2, 3 은 프리셋
}
