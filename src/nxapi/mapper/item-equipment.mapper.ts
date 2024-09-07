import { PotentialGrade } from '@prisma/client';
import * as objectHash from 'object-hash';
import { ItemEquipmentInfoDto, ItemEquipmentPresetDto, ItemOptionDto } from 'src/common/dto/item-equipment.dto';
import { NxapiItemEquipmentInfo } from 'src/nxapi/type/nxapi-item-equipment.type';

export const itemEquipmentMapper = (itemEquipmentData: any): ItemEquipmentPresetDto[] => {
  // 프리셋 4: 타이틀, 5: 드래곤 또는 메카닉 장비로 간주
  const presets = [
    { presetNo: 1, equipment: itemEquipmentData.item_equipment_preset_1 },
    { presetNo: 2, equipment: itemEquipmentData.item_equipment_preset_2 },
    { presetNo: 3, equipment: itemEquipmentData.item_equipment_preset_3 },
  ];
  if (itemEquipmentData.title)
    presets.push({
      presetNo: 4,
      equipment: [
        {
          item_equipment_part: '칭호',
          item_equipment_slot: '칭호',
          item_name: itemEquipmentData.title.title_name,
          item_icon: itemEquipmentData.title.title_icon,
          item_description: itemEquipmentData.title.title_description,
          date_expire: itemEquipmentData.title.date_expire,
          date_option_expire: itemEquipmentData.title.date_option_expire,
        },
      ],
    });
  if (itemEquipmentData.dragon_equipment.length)
    presets.push({ presetNo: 5, equipment: itemEquipmentData.dragon_equipment });
  if (itemEquipmentData.mechanic_equipment.length)
    presets.push({ presetNo: 5, equipment: itemEquipmentData.mechanic_equipment });

  // item_equipment가 사용 중이고 preset이 null인 경우 프리셋 1번에 할당
  if (!itemEquipmentData.preset_no) {
    presets[0].equipment = itemEquipmentData.item_equipment;
  }

  const mapItemOption = (options: any): ItemOptionDto | null => {
    if (!options) return null;
    const res = {
      hash: '',
      str: options.str ? parseInt(options.str) : null,
      dex: options.dex ? parseInt(options.dex) : null,
      int: options.int ? parseInt(options.int) : null,
      luk: options.luk ? parseInt(options.luk) : null,
      maxHp: options.max_hp ? parseInt(options.max_hp) : null,
      maxMp: options.max_mp ? parseInt(options.max_mp) : null,
      attackPower: options.attack_power ? parseInt(options.attack_power) : null,
      magicPower: options.magic_power ? parseInt(options.magic_power) : null,
      armor: options.armor ? parseInt(options.armor) : null,
      speed: options.speed ? parseInt(options.speed) : null,
      jump: options.jump ? parseInt(options.jump) : null,
      bossDamage: options.boss_damage ? parseInt(options.boss_damage) : null,
      ignoreMonsterArmor: options.ignore_monster_armor ? parseInt(options.ignore_monster_armor) : null,
      allStat: options.all_stat ? parseInt(options.all_stat) : null,
      damage: options.damage ? parseInt(options.damage) : null,
      equipmentLevelDecrease: options.equipment_level_decrease ? parseInt(options.equipment_level_decrease) : null,
      maxHpRate: options.max_hp_rate ? parseInt(options.max_hp_rate) : null,
      maxMpRate: options.max_mp_rate ? parseInt(options.max_mp_rate) : null,
      baseEquipmentLevel: options.base_equipment_level ? parseInt(options.base_equipment_level) : null,
      exceptionalUpgrade: options.exceptional_upgrade ? parseInt(options.exceptional_upgrade) : null,
    };
    res.hash = objectHash.sha1(res);

    return res;
  };

  const potentialGrade = (grade: string): PotentialGrade | null => {
    switch (grade) {
      case '레어':
        return 'RARE';
      case '에픽':
        return 'EPIC';
      case '유니크':
        return 'UNIQUE';
      case '레전드리':
        return 'LEGENDARY';
      default:
        return null;
    }
  };

  const extractItemImageCode = (imageUrl: string): string => {
    const url = new URL(imageUrl);
    const path = url.pathname;
    const code = path.split('/').pop().split('.')[0];
    return code;
  };

  const mapItemEquipment = (item: NxapiItemEquipmentInfo): ItemEquipmentInfoDto => {
    const res = {
      hash: '',
      part: item.item_equipment_part,
      slot: item.item_equipment_slot,
      name: item.item_name,
      icon: item.item_icon ? extractItemImageCode(item.item_icon) : null,
      description: item.item_description || null,
      shapeName: item.item_shape_name || null,
      shapeIcon: item.item_shape_icon ? extractItemImageCode(item.item_shape_icon) : null,
      gender: item.item_gender || null,
      potentialOptionGrade: item.potential_option_grade ? potentialGrade(item.potential_option_grade) : null,
      additionalPotentialOptionGrade: item.additional_potential_option_grade
        ? potentialGrade(item.additional_potential_option_grade.toUpperCase())
        : null,
      potentialOption: [
        item.potential_option_1 || null,
        item.potential_option_2 || null,
        item.potential_option_3 || null,
      ],
      additionalPotentialOption: [
        item.additional_potential_option_1 || null,
        item.additional_potential_option_2 || null,
        item.additional_potential_option_3 || null,
      ],
      equipmentLevelIncrease: item.equipment_level_increase || null,
      growthExp: item.growth_exp || null,
      growthLevel: item.growth_level || null,
      scrollUpgrade: parseInt(item.scroll_upgrade) || null,
      cuttableCount: parseInt(item.cuttable_count) || null,
      goldenHammerFlag: item?.golden_hammer_flag == null ? null : item.golden_hammer_flag === '적용',
      scrollResilienceCount: parseInt(item.scroll_resilience_count) || null,
      scrollUpgradeableCount: parseInt(item.scroll_upgradeable_count) || null,
      soulName: item.soul_name || null,
      soulOption: item.soul_option || null,
      starforce: parseInt(item.starforce) || null,
      starforceScrollFlag: item?.starforce_scroll_flag == null ? null : item.starforce_scroll_flag === '사용',
      specialRingLevel: item.special_ring_level || null,
      dateExpire: item.date_expire ? new Date(item.date_expire) : null,
      dateOptionExpire: item.date_option_expire
        ? new Date(item.date_option_expire === 'expired' ? '1999-01-01T00:00:00' : item.date_option_expire)
        : null,
      totalOption: item.item_total_option ? mapItemOption(item.item_total_option) : null,
      baseOption: item.item_base_option ? mapItemOption(item.item_base_option) : null,
      exceptionalOption: item.item_exceptional_option ? mapItemOption(item.item_exceptional_option) : null,
      addOption: item.item_add_option ? mapItemOption(item.item_add_option) : null,
      etcOption: item.item_etc_option ? mapItemOption(item.item_etc_option) : null,
      starforceOption: item.item_starforce_option ? mapItemOption(item.item_starforce_option) : null,
    };

    res.hash = objectHash.sha1(res);

    return res;
  };

  return presets.flatMap(({ presetNo, equipment: itemEquipment }): ItemEquipmentPresetDto => {
    return {
      presetNo: presetNo,
      itemEquipmentInfo: itemEquipment.map((item) => mapItemEquipment(item)),
      active: itemEquipmentData.preset_no === presetNo || (presetNo === 1 && !itemEquipmentData.preset_no),
    };
  });
};
