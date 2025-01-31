import * as objectHash from 'object-hash';
import { HexaStatDto } from 'src/common/dto/hexa-stat.dto';
import { NxapiHexaMatrixStatData, NxapiHexaStatCoreInfo } from '../type/nxapi-hexamatrix-stat.type';

const mapHexaStatCore = (coreInfo: NxapiHexaStatCoreInfo): HexaStatDto => {
  const core = {
    hash: '',
    presetNo: 0,
    hexaStatNo: 0,
    active: false,
    mainStatName: coreInfo.main_stat_name,
    mainStatLevel: coreInfo.main_stat_level,
    subStat1Name: coreInfo.sub_stat_name_1,
    subStat1Level: coreInfo.sub_stat_level_1,
    subStat2Name: coreInfo.sub_stat_name_2,
    subStat2Level: coreInfo.sub_stat_level_2,
    statGrade: coreInfo.stat_grade,
  };

  // active 여부는 db 해시랑 상관없어서 여기서 설정
  core.hash = objectHash.sha1(core);
  core.presetNo = parseInt(coreInfo.slot_id);
  return core;
};

export const hexaStatMapper = (hexaStatData: NxapiHexaMatrixStatData): HexaStatDto[] => {
  // 현재 적용 중인 코어 정보
  const currentCore = mapHexaStatCore(hexaStatData.character_hexa_stat_core[0]);
  const currentCore2 = mapHexaStatCore(hexaStatData.character_hexa_stat_core_2[0]);

  // 프리셋 코어 정보
  const presetCores = hexaStatData.preset_hexa_stat_core.map((core) => ({
    ...mapHexaStatCore(core),
    hexaStatNo: 1,
  }));
  const presetCores2 = hexaStatData.preset_hexa_stat_core_2.map((core) => ({
    ...mapHexaStatCore(core),
    hexaStatNo: 2,
  }));

  // active 상태 설정
  const markActivePreset = (current: HexaStatDto, preset: HexaStatDto[]) => {
    return preset.map((presetCore) => ({
      ...presetCore,
      active: current.presetNo === presetCore.presetNo,
    }));
  };

  return [...markActivePreset(currentCore, presetCores), ...markActivePreset(currentCore2, presetCores2)];
};
