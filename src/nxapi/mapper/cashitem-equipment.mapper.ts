import * as objectHash from 'object-hash';
import { CashEquipmentInfoDto, CashEquipmentPresetDto } from 'src/common/dto/cash-equipment.dto';
import { ItemOptionDto } from 'src/common/dto/item-equipment.dto';
import { extractImageCode } from 'src/common/util/extract-image-code';
import {
  NxApiCashEquipment,
  NxApiCashEquipmentInfo,
  NxApiCashEquipmentOption,
} from '../type/nxapi-cash-equipment.type';

const getPrismRangeEnum = (colorRange: string) => {
  switch (colorRange) {
    case '전체 색상 계열':
      return 'ALL';
    case '빨간색 계열':
      return 'RED';
    case '노란색 계열':
      return 'YELLOW';
    case '초록색 계열':
      return 'GREEN';
    case '청록색 계열':
      return 'CYAN';
    case '파란색 계열':
      return 'BLUE';
    case '자주색 계열':
      return 'PURPLE';
  }
};

const getOptionOrNull = (option: NxApiCashEquipmentOption[], type: string): number | null => {
  const found = option.find((o) => o.option_type === type);
  return found ? parseInt(found.option_value) : null;
};

const mapCashItemOption = (option: NxApiCashEquipmentOption[]): ItemOptionDto => {
  if (!option || option.length === 0) return null;
  const res = {
    hash: '',
    str: getOptionOrNull(option, 'STR'),
    dex: getOptionOrNull(option, 'DEX'),
    int: getOptionOrNull(option, 'INT'),
    luk: getOptionOrNull(option, 'LUK'),
    maxHp: getOptionOrNull(option, '최대 HP'),
    maxMp: getOptionOrNull(option, '최대 MP'),
    attackPower: getOptionOrNull(option, '공격력'),
    magicPower: getOptionOrNull(option, '마력'),
    armor: getOptionOrNull(option, '방어력'),
    speed: getOptionOrNull(option, '이동속도'),
    jump: getOptionOrNull(option, '점프력'),
    bossDamage: null,
    ignoreMonsterArmor: null,
    allStat: null,
    damage: null,
    equipmentLevelDecrease: null,
    maxHpRate: null,
    maxMpRate: null,
    baseEquipmentLevel: null,
    exceptionalUpgrade: null,
  };
  console.log(res);
  res.hash = objectHash.sha1(res);

  return res;
};

const mapCashItemInfo = (info: NxApiCashEquipmentInfo): CashEquipmentInfoDto => {
  return {
    part: info.cash_item_equipment_part,
    slot: info.cash_item_equipment_slot,
    name: info.cash_item_name,
    icon: extractImageCode(info.cash_item_icon),
    description: info.cash_item_description || null,
    dateExpire: info.date_expire ? new Date(info.date_expire) : null,
    dateOptionExpire: info.date_option_expire ? new Date(info.date_option_expire) : null,
    label: info.cash_item_label || null,
    itemGender: info.item_gender || null,
    option: info.cash_item_option ? mapCashItemOption(info.cash_item_option) : null,
    coloringPrismRange: info.cash_item_coloring_prism?.color_range
      ? getPrismRangeEnum(info.cash_item_coloring_prism?.color_range)
      : null,
    coloringPrismHue: info.cash_item_coloring_prism?.hue || null,
    coloringPrismSaturation: info.cash_item_coloring_prism?.saturation || null,
    coloringPrismValue: info.cash_item_coloring_prism?.value || null,
  };
};

export const cashEquipmentMapper = (equipment: NxApiCashEquipment): CashEquipmentPresetDto[] => {
  const activePresetNo = equipment.preset_no + (equipment.character_look_mode === '1' ? 4 : 0);

  const presetKeys = [
    'cash_item_equipment_base',
    'cash_item_equipment_preset_1',
    'cash_item_equipment_preset_2',
    'cash_item_equipment_preset_3',
    'additional_cash_item_equipment_base',
    'additional_cash_item_equipment_preset_1',
    'additional_cash_item_equipment_preset_2',
    'additional_cash_item_equipment_preset_3',
  ];

  const preset = presetKeys.map((key, index) => ({
    presetNo: index,
    active: index === activePresetNo,
    cashEquipmentInfo: equipment[key].map(mapCashItemInfo),
  }));

  return preset;
};
