import { HexaCoreType } from '@prisma/client';
import { createHash } from 'crypto';
import { HexaCoreDto, HexaCoreSkillDto, HexaMatrixDto } from 'src/common/dto/hexa-matrix.dto';
import { extractImageCode } from 'src/common/util/extract-image-code';
import { NxapiHexaMatrixData, NxapiSkillGrade6Data } from '../type/nxapi-hexa-matrix.type';

// 스킬 정보 찾기 헬퍼 함수
const findSkillInfo = (skillId: string, grade6Data: NxapiSkillGrade6Data) => {
  return grade6Data.character_skill?.find((skill) => skill.skill_name === skillId);
};

// 코어 타입 매핑
const coreTypeMap: Record<string, HexaCoreType> = {
  '마스터리 코어': 'MASTERY_CORE',
  '스킬 코어': 'SKILL_CORE',
  '강화 코어': 'ENHANCEMENT_CORE',
  '공용 코어': 'COMMON_CORE',
};

// 내부 타입 정의
interface HexaCoreSkillWithHash extends HexaCoreSkillDto {
  effectHash: string | null;
  nextEffectHash: string | null;
}

interface HexaCoreWithHash extends Omit<HexaCoreDto, 'skills'> {
  descriptionHash: string | null;
  skills: HexaCoreSkillWithHash[];
}

export interface HexaMatrixWithHash extends Omit<HexaMatrixDto, 'cores'> {
  cores: HexaCoreWithHash[];
}

export const hexaCoreMapper = (
  hexaMatrix: NxapiHexaMatrixData,
  skillGrade6: NxapiSkillGrade6Data,
): HexaMatrixWithHash => {
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
    cores: hexaMatrix.character_hexa_core_equipment.map((core) => {
      const firstSkill = core.linked_skill[0];
      const firstSkillInfo = firstSkill ? findSkillInfo(firstSkill.hexa_skill_id, skillGrade6) : null;

      return {
        coreName: core.hexa_core_name,
        coreLevel: core.hexa_core_level,
        coreType: coreTypeMap[core.hexa_core_type],
        description: firstSkillInfo?.skill_description ?? '',
        descriptionHash: firstSkillInfo?.skill_description
          ? createHash('sha256').update(firstSkillInfo.skill_description).digest('hex')
          : null,
        skills: core.linked_skill.map((skill) => {
          const skillInfo = findSkillInfo(skill.hexa_skill_id, skillGrade6);
          const currentEffect = skillInfo?.skill_effect ?? null;
          const nextEffect = skillInfo?.skill_effect_next ?? null;

          return {
            skillName: skill.hexa_skill_id,
            description: skillInfo?.skill_description ?? '',
            skillIcon: extractImageCode(skillInfo?.skill_icon),
            currentEffect,
            nextEffect,
            effectHash: currentEffect ? createHash('sha256').update(currentEffect).digest('hex') : null,
            nextEffectHash: nextEffect ? createHash('sha256').update(nextEffect).digest('hex') : null,
          };
        }),
      };
    }),
  };
};
