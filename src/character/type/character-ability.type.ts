export interface CharacterAbility {
  id?: number;
  characterId?: number;
  abilityGrade: string;
  abilityNo: number;
  abilityValue: string;
  presetNo: number;
  active: boolean;
}

// 어빌리티의 개별 정보 타입
export interface AbilityInfo {
  ability_no: string;
  ability_grade: string;
  ability_value: string;
}

// 프리셋 어빌리티 정보 타입
export interface PresetAbilityInfo {
  ability_preset_grade: string;
  ability_info: AbilityInfo[];
}

// 전체 어빌리티 데이터 구조
export interface AbilityData {
  ability_info: AbilityInfo[];
  remain_fame: number;
  ability_preset_1?: PresetAbilityInfo;
  ability_preset_2?: PresetAbilityInfo;
  ability_preset_3?: PresetAbilityInfo;
}
