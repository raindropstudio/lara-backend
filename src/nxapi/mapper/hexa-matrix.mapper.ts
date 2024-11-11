import { HexaMatrixDto } from 'src/common/dto/hexa-matrix.dto';
import { extractImageCode } from 'src/common/util/extract-image-code';
import { NxapiHexaMatrixData, NxapiSkillGrade6Data } from '../type/nxapi-hexa-matrix.type';

// 스킬 정보 찾기 헬퍼 함수
const findSkillInfo = (skillId: string, grade6Data: NxapiSkillGrade6Data) => {
  return grade6Data.character_skill?.find((skill) => skill.skill_name === skillId);
};

export const hexaCoreMapper = (hexaMatrix: NxapiHexaMatrixData, skillGrade6: NxapiSkillGrade6Data): HexaMatrixDto => {
  if (!hexaMatrix || !skillGrade6) {
    console.log('데이터 오류:', { hexaMatrix, skillGrade6 });
    return {
      date: null,
      characterClass: '',
      cores: [],
    };
  }

  return {
    date: hexaMatrix.date,
    characterClass: skillGrade6.character_class,
    cores: hexaMatrix.character_hexa_core_equipment.map((core) => ({
      coreName: core.hexa_core_name,
      coreLevel: core.hexa_core_level,
      coreType: core.hexa_core_type,
      skills: core.linked_skill.map((skill) => {
        const skillInfo = findSkillInfo(skill.hexa_skill_id, skillGrade6);
        return {
          skillName: skill.hexa_skill_id,
          description: skillInfo?.skill_description ?? '',
          skillIcon: extractImageCode(skillInfo?.skill_icon) ?? null,
          currentEffect: skillInfo?.skill_effect ?? null,
          nextEffect: skillInfo?.skill_effect_next ?? null,
        };
      }),
    })),
  };
};
