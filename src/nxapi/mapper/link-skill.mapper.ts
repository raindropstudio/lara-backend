import * as objectHash from 'object-hash';
import { CharacterLinkSkillDto, LinkSkillDto } from 'src/common/dto/link-skill.dto';
import { extractImageCode } from 'src/common/util/extract-image-code';
import { NxapiLinkSkillData, NxapiLinkSkillInfo } from '../type/nxapi-link-skill.type';

const mapLinkSkill = (skillInfo: NxapiLinkSkillInfo): LinkSkillDto => {
  const skill = {
    hash: '',
    grade: 'link',
    name: skillInfo.skill_name,
    description: skillInfo.skill_description || null,
    level: skillInfo.skill_level,
    effect: skillInfo.skill_effect,
    icon: extractImageCode(skillInfo.skill_icon),
    effectNext: skillInfo.skill_effect_next || null,
  };

  skill.hash = objectHash.sha1(skill);
  return skill;
};

export const linkSkillMapper = (linkSkillData: NxapiLinkSkillData): CharacterLinkSkillDto[] => {
  const presets = [
    {
      presetNo: 0,
      skills: linkSkillData.character_link_skill || [],
      ownedSkill: linkSkillData.character_owned_link_skill,
    },
    {
      presetNo: 1,
      skills: linkSkillData.character_link_skill_preset_1 || [],
      ownedSkill: linkSkillData.character_owned_link_skill_preset_1,
    },
    {
      presetNo: 2,
      skills: linkSkillData.character_link_skill_preset_2 || [],
      ownedSkill: linkSkillData.character_owned_link_skill_preset_2,
    },
    {
      presetNo: 3,
      skills: linkSkillData.character_link_skill_preset_3 || [],
      ownedSkill: linkSkillData.character_owned_link_skill_preset_3,
    },
  ];

  return presets
    .filter(({ skills }) => skills.length > 0)
    .map(({ presetNo, skills, ownedSkill }) => ({
      skill: skills.map((skill) => mapLinkSkill(skill)),
      ownedSkill: ownedSkill
        ? mapLinkSkill({
            skill_name: ownedSkill.skill_name,
            skill_description: ownedSkill.skill_description,
            skill_level: ownedSkill.skill_level,
            skill_effect: ownedSkill.skill_effect,
            skill_icon: ownedSkill.skill_icon,
          })
        : null,
      presetNo,
    }));
};
