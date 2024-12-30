// V매트릭스 코어 정보 인터페이스
export interface NxapiVMatrixCoreInfo {
  slot_id: string;
  slot_level: number;
  v_core_name: string;
  v_core_type: string;
  v_core_level: number;
  v_core_skill_1: string;
  v_core_skill_2: string;
  v_core_skill_3: string;
}

// V매트릭스 데이터 구조
export interface NxapiVMatrixData {
  date: string | null;
  character_class: string;
  character_v_core_equipment: NxapiVMatrixCoreInfo[];
  character_v_matrix_remain_slot_upgrade_point: number;
}
