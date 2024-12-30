import { Prisma } from '@prisma/client';
import { CharacterSkillCoreDto } from 'src/common/dto/skill-core.dto';

type SkillCoreEntity = Prisma.CharacterGetPayload<{
  include: {
    skillCore: {
      include: {
        skillCore: true;
      };
    };
  };
}>['skillCore'];

export function convertSkillCoreToDto(skillCoreEntity: SkillCoreEntity): CharacterSkillCoreDto[] {
  if (!skillCoreEntity) return null;

  return skillCoreEntity.map((core) => ({
    ...core,
    skillCore: {
      ...core.skillCore,
      coreSkill: core.skillCore.coreSkill as string[],
    },
  }));
}
