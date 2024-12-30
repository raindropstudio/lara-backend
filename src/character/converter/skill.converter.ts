import { Prisma } from '@prisma/client';
import { CharacterSkillDto } from 'src/common/dto/skill.dto';

type SkillEntity = Prisma.CharacterGetPayload<{
  include: {
    skill: {
      include: {
        skill: true;
      };
    };
  };
}>['skill'];

export function convertSkillToDto(skillEntity: SkillEntity): CharacterSkillDto[] {
  if (!skillEntity) return null;
  return skillEntity.map((skill) => ({
    ...skill.skill,
  }));
}
