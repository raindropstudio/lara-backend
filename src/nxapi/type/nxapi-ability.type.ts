// 어빌리티의 개별 정보 타입
export interface NxapiAbilityInfo {
  ability_no: string;
  ability_grade: string;
  ability_value: string;
}

// 프리셋 어빌리티 정보 타입
export interface NxapiPresetAbilityInfo {
  ability_preset_grade: string;
  ability_info: NxapiAbilityInfo[];
}

// 전체 어빌리티 데이터 구조
export interface NxapiAbilityData {
  ability_info: NxapiAbilityInfo[];
  preset_no: number;
  remain_fame: number;
  ability_preset_1?: NxapiPresetAbilityInfo;
  ability_preset_2?: NxapiPresetAbilityInfo;
  ability_preset_3?: NxapiPresetAbilityInfo;
}
