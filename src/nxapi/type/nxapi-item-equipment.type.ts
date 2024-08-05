export interface NxapiItemEquipment {
  item_equipment: NxapiItemEquipmentInfo[];
  item_equipment_preset_1?: NxapiItemEquipmentInfo[];
  item_equipment_preset_2?: NxapiItemEquipmentInfo[];
  item_equipment_preset_3?: NxapiItemEquipmentInfo[];
  title: NxapiTitle;
}

export interface NxapiItemEquipmentInfo {
  item_equipment_part: string;
  item_equipment_slot: string;
  item_name: string;
  item_icon: string;
  item_description?: string;
  item_shape_name: string;
  item_shape_icon: string;
  item_gender?: string;
  item_total_option: NxapiItemOption;
  item_base_option: NxapiItemOption;
  potential_option_grade: string;
  additional_potential_option_grade: string;
  potential_option_1: string;
  potential_option_2: string;
  potential_option_3: string;
  additional_potential_option_1: string;
  additional_potential_option_2: string;
  additional_potential_option_3: string;
  equipment_level_increase: number;
  item_exceptional_option: NxapiItemOption;
  item_add_option: NxapiItemOption;
  growth_exp: number;
  growth_level: number;
  scroll_upgrade: string;
  cuttable_count: string;
  golden_hammer_flag: string;
  scroll_resilience_count: string;
  scroll_upgradeable_count?: string;
  soul_name?: string;
  soul_option?: string;
  item_etc_option: NxapiItemOption;
  starforce: string;
  starforce_scroll_flag: string;
  item_starforce_option: NxapiItemOption;
  special_ring_level: number;
  date_expire: string;
}

export interface NxapiItemOption {
  str: string;
  dex: string;
  int: string;
  luk: string;
  max_hp: string;
  max_mp: string;
  attack_power: string;
  magic_power: string;
  armor: string;
  speed: string;
  jump: string;
  boss_damage: string;
  ignore_monster_armor: string;
  all_stat: string;
  damage: string;
  equipment_level_decrease: number;
  max_hp_rate: string;
  max_mp_rate: string;
  base_equipment_level: number;
}

export interface NxapiTitle {
  title_name: string;
  title_icon: string;
  title_description: string;
  date_expire: string;
  date_option_expire: string;
}
