// HexaMatrix API 응답 타입
export interface NxapiHexaMatrixData {
  date: string | null;
  character_hexa_core_equipment: Array<{
    hexa_core_name: string;
    hexa_core_level: number;
    hexa_core_type: '마스터리 코어' | '스킬 코어' | '강화 코어' | '공용 코어';
    linked_skill: Array<{
      hexa_skill_id: string;
    }>;
  }>;
}

// Grade6 API 응답 타입
export interface NxapiSkillGrade6Data {
  date: string | null;
  character_class: string;
  character_skill_grade: '6';
  character_skill: Array<{
    skill_name: string;
    skill_description: string;
    skill_level: number;
    skill_effect: string | null;
    skill_icon: string;
    skill_effect_next: string | null;
  }>;
}
