// 헥사 매트릭스 스킬 정보 인터페이스
export interface NxapiHexaSkillInfo {
  hexa_skill_id: string;
}

// 헥사 매트릭스 코어 정보 인터페이스
export interface NxapiHexaCoreInfo {
  hexa_core_name: string;
  hexa_core_level: number;
  hexa_core_type: string;
  linked_skill: NxapiHexaSkillInfo[];
}

// 헥사 매트릭스 데이터 구조
export interface NxapiHexaMatrixData {
  date: string | null;
  character_hexa_core_equipment: NxapiHexaCoreInfo[];
}
