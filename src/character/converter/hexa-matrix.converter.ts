import { CharacterHexaCore, HexaCore, HexaCoreSkill, HexaCoreSkillEffect, HexaCoreType } from '@prisma/client';
import { HexaMatrixDto } from 'src/common/dto/hexa-matrix.dto';

const coreTypeMap: Record<HexaCoreType, '스킬 코어' | '강화 코어' | '공용 코어' | '마스터리 코어'> = {
  MASTERY_CORE: '마스터리 코어',
  SKILL_CORE: '스킬 코어',
  ENHANCEMENT_CORE: '강화 코어',
  COMMON_CORE: '공용 코어',
};

type CharacterHexaCoreWithRelations = CharacterHexaCore & {
  core: HexaCore & {
    skills: (HexaCoreSkill & {
      levelEffects: HexaCoreSkillEffect[];
    })[];
  };
};

export const convertHexaMatrixToDto = (hexaCores: CharacterHexaCoreWithRelations[]): HexaMatrixDto => {
  if (!hexaCores?.length) return null;

  return {
    date: null,
    characterClass: hexaCores[0].core.characterClass,
    cores: hexaCores.map((core) => ({
      coreName: core.core.coreName,
      coreLevel: core.coreLevel,
      coreType: coreTypeMap[core.core.coreType],
      skills: core.core.skills.map((skill) => {
        const currentEffect = skill.levelEffects.find((e) => e.level === core.coreLevel)?.effect ?? null;
        const nextEffect = skill.levelEffects.find((e) => e.level === core.coreLevel + 1)?.effect ?? null; // 다음레벨 효과
        return {
          skillName: skill.skillName,
          description: core.core.description ?? null,
          skillIcon: skill.skillIcon,
          currentEffect,
          nextEffect,
        };
      }),
    })),
  };
};
