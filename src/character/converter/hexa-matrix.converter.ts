import { CharacterHexaCore, HexaCore, HexaCoreSkill, HexaCoreSkillEffect } from '@prisma/client';
import { HexaMatrixDto } from 'src/common/dto/hexa-matrix.dto';

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
      coreType: core.core.coreType,
      skills: core.core.skills.map((skill) => {
        const currentEffect = skill.levelEffects.find((e) => e.level === core.coreLevel)?.effect ?? null;
        const nextEffect = skill.levelEffects.find((e) => e.level === core.coreLevel + 1)?.effect ?? null;
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
