import { Prisma } from '@prisma/client';
import { ItemEquipmentInfoDto, ItemEquipmentPresetDto } from 'src/common/dto/item-equipment.dto';

type ItemEquipmentEntity = Prisma.CharacterGetPayload<{
  include: {
    itemEquipmentPreset: {
      include: {
        itemEquipment: {
          include: {
            ItemEquipmentOption: {
              include: {
                option: true;
              };
            };
            ItemEquipmentPotential: {
              include: {
                potential: true;
              };
            };
          };
        };
      };
    };
  };
}>['itemEquipmentPreset'];
type ItemEquipmentFlatten = ItemEquipmentInfoDto & { presetNo: number; active: boolean };

export const convertItemEquipmentToEntity = (itemEquipmentPreset: ItemEquipmentPresetDto[]): ItemEquipmentFlatten[] => {
  return itemEquipmentPreset.flatMap((itemEquipmentInfo) => {
    return itemEquipmentInfo.itemEquipmentInfo.map((itemEquipment) => {
      return {
        ...itemEquipment,
        active: itemEquipmentInfo.active,
        presetNo: itemEquipmentInfo.presetNo,
      };
    });
  });
};

export const convertItemEquipmentToDto = (itemEquipmentEntity: ItemEquipmentEntity): ItemEquipmentPresetDto[] => {
  if (!itemEquipmentEntity) return null;

  const itemEquipmentPresets: ItemEquipmentPresetDto[] = [
    { presetNo: 1, active: false, itemEquipmentInfo: [] },
    { presetNo: 2, active: false, itemEquipmentInfo: [] },
    { presetNo: 3, active: false, itemEquipmentInfo: [] },
    { presetNo: 4, active: false, itemEquipmentInfo: [] }, // 타이틀
    { presetNo: 5, active: false, itemEquipmentInfo: [] }, // 드래곤 or 메카닉 장비
  ];

  const getPotentialText = (itemEquipment, potentialNo: number) => {
    return itemEquipment.ItemEquipmentPotential.find((potential) => potential.potentialNo === potentialNo)?.potential
      ?.potential;
  };

  const getPotentials = (itemEquipment) => {
    const res = {};
    if (itemEquipment.potentialOptionGrade) {
      res['potentialOption'] = [
        getPotentialText(itemEquipment, 1),
        getPotentialText(itemEquipment, 2),
        getPotentialText(itemEquipment, 3),
      ].filter(Boolean);
    }
    if (itemEquipment.additionalPotentialOptionGrade) {
      res['additionalPotentialOption'] = [
        getPotentialText(itemEquipment, 4),
        getPotentialText(itemEquipment, 5),
        getPotentialText(itemEquipment, 6),
      ].filter(Boolean);
    }
    return res;
  };

  const getOption = (itemEquipment, optionType: 'TOTAL' | 'BASE' | 'EXCEPTIONAL' | 'ADD' | 'ETC' | 'STARFORCE') => {
    return itemEquipment.ItemEquipmentOption.find((option) => option.optionType === optionType)?.option;
  };

  itemEquipmentEntity.forEach((eq) => {
    const preset = itemEquipmentPresets.find((p) => p.presetNo === eq.presetNo);
    if (preset) {
      preset.active = eq.active; // 활성화 여부 설정
      preset.itemEquipmentInfo.push({
        ...eq.itemEquipment,
        ...getPotentials(eq.itemEquipment),
        totalOption: getOption(eq.itemEquipment, 'TOTAL'),
        baseOption: getOption(eq.itemEquipment, 'BASE'),
        exceptionalOption: getOption(eq.itemEquipment, 'EXCEPTIONAL'),
        addOption: getOption(eq.itemEquipment, 'ADD'),
        etcOption: getOption(eq.itemEquipment, 'ETC'),
        starforceOption: getOption(eq.itemEquipment, 'STARFORCE'),
      });
    }
  });

  if (itemEquipmentPresets[4].itemEquipmentInfo.length === 0) {
    return itemEquipmentPresets.slice(0, 4);
  }

  return itemEquipmentPresets;
};
