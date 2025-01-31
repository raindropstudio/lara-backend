import * as objectHash from 'object-hash';
import { CharacterSkillCoreDto, SkillCoreDto } from 'src/common/dto/skill-core.dto';
import { NxapiHexaCoreInfo, NxapiHexaMatrixData } from '../type/nxapi-hexamatrix.type';

const mapHexaCore = (coreInfo: NxapiHexaCoreInfo): SkillCoreDto => {
  const core = {
    hash: '',
    grade: 6,
    coreName: coreInfo.hexa_core_name,
    coreType: coreInfo.hexa_core_type,
    coreSkill: coreInfo.linked_skill.map((skill) => skill.hexa_skill_id),
  };

  core.hash = objectHash.sha1(core);
  return core;
};

export const hexaMatrixMapper = (hexaMatrixData: NxapiHexaMatrixData): CharacterSkillCoreDto[] => {
  if (!hexaMatrixData.character_hexa_core_equipment) return [];
  return hexaMatrixData.character_hexa_core_equipment.map((coreInfo) => ({
    skillCore: mapHexaCore(coreInfo),
    slotId: null,
    slotLevel: null,
    coreLevel: coreInfo.hexa_core_level,
  }));
};
