import { Prisma } from '@prisma/client';
import { CharacterLinkSkillDto, LinkSkillDto } from 'src/common/dto/link-skill.dto';

type LinkSkillEntity = Prisma.CharacterGetPayload<{
  include: {
    linkSkill: {
      include: {
        skill: true;
      };
    };
  };
}>['linkSkill'];

type LinkSkillFlatten = {
  presetNo: number;
  ownedSkill: boolean;
  skillHash: string;
};

export function convertLinkSkillToEntity(linkSkillDto: CharacterLinkSkillDto[]): LinkSkillFlatten[] {
  if (!linkSkillDto) return null;

  const result: LinkSkillFlatten[] = [];

  linkSkillDto.forEach((preset) => {
    // 보유 스킬 처리
    if (preset.ownedSkill) {
      result.push({
        presetNo: preset.presetNo,
        ownedSkill: true,
        skillHash: preset.ownedSkill.hash,
      });
    }

    // 링크 스킬 목록 처리
    preset.skill.forEach((skill) => {
      result.push({
        presetNo: preset.presetNo,
        ownedSkill: false,
        skillHash: skill.hash,
      });
    });
  });

  return result;
}

export function convertLinkSkillToDto(linkSkillEntity: LinkSkillEntity): CharacterLinkSkillDto[] {
  if (!linkSkillEntity) return null;

  const presetGroups = new Map<number, CharacterLinkSkillDto>();

  linkSkillEntity.forEach((cls) => {
    const presetNo = cls.presetNo;

    if (!presetGroups.has(presetNo)) {
      presetGroups.set(presetNo, {
        presetNo,
        ownedSkill: null,
        skill: [],
      });
    }

    const preset = presetGroups.get(presetNo);
    const skillDto: LinkSkillDto = cls.skill;

    if (cls.ownedSkill) {
      preset.ownedSkill = skillDto;
    } else {
      preset.skill.push(skillDto);
    }
  });

  return Array.from(presetGroups.values());
}
