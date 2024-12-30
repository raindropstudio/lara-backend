import { Expose } from 'class-transformer';

export class CharacterSkillDto {
  hash: string;

  @Expose()
  grade: string;

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
