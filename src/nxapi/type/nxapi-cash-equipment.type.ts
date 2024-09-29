export interface NxApiCashEquipmentOption {
  option_type: string;
  option_value: string;
}

export interface NxApiCashEquipmentColoringPrism {
  color_range: string;
  hue: number;
  saturation: number;
  value: number;
}

export interface NxApiCashEquipmentInfo {
  cash_item_equipment_part: string;
  cash_item_equipment_slot: string;
  cash_item_name: string;
  cash_item_icon: string;
  cash_item_description: string | null;
  cash_item_option: NxApiCashEquipmentOption[];
  date_expire: string | null;
  date_option_expire: string | null;
  cash_item_label: string | null;
  cash_item_coloring_prism: NxApiCashEquipmentColoringPrism | null;
  item_gender: string | null;
}

export interface NxApiCashEquipment {
  date: string | null;
  character_gender: string;
  character_class: string;
  character_look_mode: string;
  preset_no: number;
  cash_item_equipment_base: NxApiCashEquipmentInfo[];
  cash_item_equipment_preset_1: NxApiCashEquipmentInfo[];
  cash_item_equipment_preset_2: NxApiCashEquipmentInfo[];
  cash_item_equipment_preset_3: NxApiCashEquipmentInfo[];
  additional_cash_item_equipment_base: NxApiCashEquipmentInfo[];
  additional_cash_item_equipment_preset_1: NxApiCashEquipmentInfo[];
  additional_cash_item_equipment_preset_2: NxApiCashEquipmentInfo[];
  additional_cash_item_equipment_preset_3: NxApiCashEquipmentInfo[];
}
