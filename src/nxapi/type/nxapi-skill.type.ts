// 스킬 정보 공통 인터페이스
export interface NxapiSkillInfo {
  skill_name: string;
  skill_description: string;
  skill_level: number;
  skill_effect: string | null;
  skill_icon: string;
  skill_effect_next: string | null;
}

// 스킬 데이터 인터페이스
export interface NxapiSkillData {
  date: string | null;
  character_class: string;
  character_skill_grade: string;
  character_skill: NxapiSkillInfo[];
}
