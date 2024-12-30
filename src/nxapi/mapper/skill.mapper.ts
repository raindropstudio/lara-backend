import * as objectHash from 'object-hash';
import { CharacterSkillDto } from 'src/common/dto/skill.dto';
import { extractImageCode } from 'src/common/util/extract-image-code';
import { NxapiSkillData, NxapiSkillInfo } from '../type/nxapi-skill.type';

const mapSkill = (grade: string, skillInfo: NxapiSkillInfo): CharacterSkillDto => {
  const skill = {
    hash: '',
    grade,
    name: skillInfo.skill_name,
    description: skillInfo.skill_description || null,
    level: skillInfo.skill_level,
    effect: skillInfo.skill_effect || null,
    icon: extractImageCode(skillInfo.skill_icon),
    effectNext: skillInfo.skill_effect_next || null,
  };

  skill.hash = objectHash.sha1(skill);
  return skill;
};

export const skillMapper = (grade: string, skillData: NxapiSkillData): CharacterSkillDto[] => {
  return skillData.character_skill.map((skillInfo) => mapSkill(grade, skillInfo));
};
