import { CharacterItemEquipment, ItemOption, Title } from '../type/character-item-equipment.type';
import { NxapiItemEquipment, NxapiItemEquipmentInfo, NxapiItemOption } from 'src/nxapi/type/nxapi-item-equipment.type';

// NxapiItemOption을 ItemOption으로 변환
const mapItemOption = (option: NxapiItemOption): ItemOption => ({
  str: option.str,
  dex: option.dex,
  int: option.int,
  luk: option.luk,
  maxHp: option.max_hp,
  maxMp: option.max_mp,
  attackPower: option.attack_power,
  magicPower: option.magic_power,
  armor: option.armor,
  speed: option.speed,
  jump: option.jump,
  bossDamage: option.boss_damage,
  ignoreMonsterArmor: option.ignore_monster_armor,
  allStat: option.all_stat,
  damage: option.damage,
  equipmentLevelDecrease: option.equipment_level_decrease,
  maxHpRate: option.max_hp_rate,
  maxMpRate: option.max_mp_rate,
  baseEquipmentLevel: option.base_equipment_level,
});

// NxapiItemEquipmentInfo를 CharacterItemEquipment로 변환
const mapItemEquipmentInfo = (info: NxapiItemEquipmentInfo): CharacterItemEquipment => ({
  part: info.item_equipment_part,
  slot: info.item_equipment_slot,
  name: info.item_name,
  icon: info.item_icon,
  description: info.item_description,
  shapeName: info.item_shape_name,
  shapeIcon: info.item_shape_icon,
  gender: info.item_gender,
  totalOption: mapItemOption(info.item_total_option),
  baseOption: mapItemOption(info.item_base_option),
  potentialOptionGrade: info.potential_option_grade,
  additionalPotentialOption: info.additional_potential_option_grade,
  potentialOption1: info.potential_option_1,
  potentialOption2: info.potential_option_2,
  potentialOption3: info.potential_option_3,
  additionalPotentialOption1: info.additional_potential_option_1,
  additionalPotentialOption2: info.additional_potential_option_2,
  additionalPotentialOption3: info.additional_potential_option_3,
  equipmentLevelIncrease: info.equipment_level_increase,
  exceptionalOption: mapItemOption(info.item_exceptional_option),
  addOption: mapItemOption(info.item_add_option),
  growthExp: info.growth_exp,
  growthLevel: info.growth_level,
  scrollUpgrade: info.scroll_upgrade,
  cuttableCount: info.cuttable_count,
  goldenHammerFlag: info.golden_hammer_flag,
  scrollResilienceCount: info.scroll_resilience_count,
  scrollUpgradeableCount: info.scroll_upgradeable_count,
  soulName: info.soul_name,
  soulOption: info.soul_option,
  etcOption: mapItemOption(info.item_etc_option),
  starforce: info.starforce,
  starforceScrollFlag: info.starforce_scroll_flag,
  starforceOption: mapItemOption(info.item_starforce_option),
  specialRingLevel: info.special_ring_level,
  dateExpire: info.date_expire ? new Date(info.date_expire) : undefined,
  active: true,
});

// NxapiItemEquipment에서 Title로 변환
const mapTitle = (title: NxapiItemEquipment['title']): Title => ({
  title_name: title.title_name,
  title_icon: title.title_icon,
  title_description: title.title_description,
  date_expire: title.date_expire ? new Date(title.date_expire) : undefined,
  date_option_expire: title.date_option_expire ? new Date(title.date_option_expire) : undefined,
});

// 최종 매퍼 함수
export const characterItemEquipmentMapper = (itemEquipmentData: NxapiItemEquipment): CharacterItemEquipment[] => {
  const mainEquipments = itemEquipmentData.item_equipment.map((item: NxapiItemEquipmentInfo) => ({
    ...mapItemEquipmentInfo(item),
    active: true,
  }));

  const presetEquipments = [1, 2, 3].flatMap((presetNumber) => {
    const presetKey = `item_equipment_preset_${presetNumber}`;
    const preset = itemEquipmentData[presetKey];
    if (!preset) return [];

    return preset.map((item: NxapiItemEquipmentInfo) => ({
      ...mapItemEquipmentInfo(item),
      preset_no: presetNumber,
      active: false,
    }));
  });

  presetEquipments.forEach((presetEquipment) => {
    if (
      mainEquipments.some(
        (mainEquipment) =>
          mainEquipment.name === presetEquipment.name &&
          mainEquipment.part === presetEquipment.part &&
          mainEquipment.slot === presetEquipment.slot &&
          mainEquipment.icon === presetEquipment.icon,
      )
    ) {
      presetEquipment.active = true;
    }
  });

  const allEquipments = [...mainEquipments, ...presetEquipments].map((equipment) => ({
    ...equipment,
    title: mapTitle(itemEquipmentData.title),
  }));

  return allEquipments;
};
