import { Prisma } from '@prisma/client';
import { CashEquipmentInfoDto, CashEquipmentPresetDto } from 'src/common/dto/cash-equipment.dto';

type CashEquipmentEntity = Prisma.CharacterGetPayload<{
  include: {
    cashEquipmentPreset: {
      include: {
        cashEquipment: true;
        option: true;
      };
    };
  };
}>['cashEquipmentPreset'];
type CashEquipmentFlatten = CashEquipmentInfoDto & { presetNo: number; active: boolean };

export const convertCashEquipmentToEntity = (cashEquipmentPreset: CashEquipmentPresetDto[]): CashEquipmentFlatten[] => {
  return cashEquipmentPreset.flatMap((itemEquipmentInfo) => {
    return itemEquipmentInfo.cashEquipmentInfo.map((itemEquipment) => {
      return {
        ...itemEquipment,
        active: itemEquipmentInfo.active,
        presetNo: itemEquipmentInfo.presetNo,
      };
    });
  });
};

export const convertCashEquipmentToDto = (cashEquipmentEntity: CashEquipmentEntity): CashEquipmentPresetDto[] => {
  if (!cashEquipmentEntity) return null;

  const cashEquipmentPreset: CashEquipmentPresetDto[] = [];

  cashEquipmentEntity.forEach((cashEquipment) => {
    if (!cashEquipmentPreset[cashEquipment.presetNo]) {
      cashEquipmentPreset[cashEquipment.presetNo] = {
        presetNo: cashEquipment.presetNo,
        active: cashEquipment.active,
        cashEquipmentInfo: [],
      };
    }

    cashEquipmentPreset[cashEquipment.presetNo].active = cashEquipment.active;
    const {
      active,
      presetNo,
      optionId,
      cashEquipmentId,
      characterId,
      cashEquipment: cashEquipData,
      ...cashEquipmentInfo
    } = cashEquipment;
    cashEquipmentPreset[cashEquipment.presetNo].cashEquipmentInfo.push({
      ...cashEquipData,
      ...cashEquipmentInfo,
    });
  });

  cashEquipmentPreset.sort((a, b) => a.presetNo - b.presetNo);

  return cashEquipmentPreset;
};
