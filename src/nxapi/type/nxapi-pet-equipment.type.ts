// 펫 장비 옵션 타입
export interface NxapiPetEquipmentOption {
  option_type: string;
  option_value: string;
}

// 펫 장비 정보 타입
export interface NxapiPetEquipmentInfo {
  item_name: string;
  item_icon: string;
  item_description: string;
  item_option: NxapiPetEquipmentOption[];
  scroll_upgrade: number;
  scroll_upgradable: number;
  item_shape: string;
  item_shape_icon: string;
}

// 펫 자동 스킬 타입
export interface NxapiPetAutoSkill {
  skill_1: string;
  skill_1_icon: string;
  skill_2?: string;
  skill_2_icon?: string;
}

// 펫 개별 정보 타입
export interface NxapiPetInfo {
  pet_name: string;
  pet_nickname: string;
  pet_icon: string;
  pet_description: string;
  pet_equipment: NxapiPetEquipmentInfo;
  pet_auto_skill?: NxapiPetAutoSkill;
  pet_type: string;
  pet_skill: string; // JSON
  pet_date_expire: string;
  pet_appearance: string;
  pet_appearance_icon: string;
}

// 전체 펫 데이터 구조
export interface NxapiPetEquipmentData {
  petNo: number;
  petInfo: Partial<NxapiPetInfo>;
}
