// 링크 스킬 정보 인터페이스
export interface NxapiLinkSkillInfo {
  skill_name: string;
  skill_description: string;
  skill_level: number;
  skill_effect: string;
  skill_icon: string;
  skill_effect_next?: string | null;
}

// 보유 링크 스킬 정보 인터페이스
export interface NxapiOwnedLinkSkillInfo {
  skill_name: string;
  skill_description: string;
  skill_level: number;
  skill_effect: string;
  skill_icon: string;
}

// 전체 링크 스킬 데이터 구조
export interface NxapiLinkSkillData {
  date: string | null;
  character_class: string;
  character_link_skill: NxapiLinkSkillInfo[];
  character_link_skill_preset_1?: NxapiLinkSkillInfo[];
  character_link_skill_preset_2?: NxapiLinkSkillInfo[];
  character_link_skill_preset_3?: NxapiLinkSkillInfo[];
  character_owned_link_skill: NxapiOwnedLinkSkillInfo;
  character_owned_link_skill_preset_1?: NxapiOwnedLinkSkillInfo;
  character_owned_link_skill_preset_2?: NxapiOwnedLinkSkillInfo;
  character_owned_link_skill_preset_3?: NxapiOwnedLinkSkillInfo;
}
