import * as objectHash from 'object-hash';
import { CharacterSkillCoreDto, SkillCoreDto } from 'src/common/dto/skill-core.dto';
import { NxapiVMatrixCoreInfo, NxapiVMatrixData } from '../type/nxapi-vmatrix.type';

const mapVMatrixCore = (coreInfo: NxapiVMatrixCoreInfo): SkillCoreDto => {
  const core = {
    hash: '',
    grade: 5,
    coreName: coreInfo.v_core_name,
    coreType: coreInfo.v_core_type,
    coreSkill: [coreInfo.v_core_skill_1, coreInfo.v_core_skill_2, coreInfo.v_core_skill_3].filter(Boolean),
  };

  core.hash = objectHash.sha1(core);
  return core;
};

export const vMatrixMapper = (vMatrixData: NxapiVMatrixData): CharacterSkillCoreDto[] => {
  return vMatrixData.character_v_core_equipment
    .filter((coreInfo) => coreInfo.v_core_name)
    .map((coreInfo) => ({
      skillCore: mapVMatrixCore(coreInfo),
      slotId: parseInt(coreInfo.slot_id),
      slotLevel: coreInfo.slot_level,
      coreLevel: coreInfo.v_core_level,
    }));
};
