import { Injectable } from '@nestjs/common';
import { CashEquipmentPresetDto } from 'src/common/dto/cash-equipment.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { convertCashEquipmentToEntity } from '../converter/cash-equipment.converter';

@Injectable()
export class CashEquipmentRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createOrIgnoreCashEquipment(cashEquipment: CashEquipmentPresetDto[]) {
    const flatCashEquipment = convertCashEquipmentToEntity(cashEquipment);

    // 캐시장비 저장
    for (const cashEquip of flatCashEquipment) {
      // 캐시장비 존재 여부 아이콘으로 확인
      const existingCashEquipment = await this.prismaService.cashEquipment.findUnique({
        where: { icon: cashEquip.icon },
      });

      // 이미 존재하는 장비라면 넘어감
      if (existingCashEquipment) continue;

      // 장비 생성, 단 고유키 충돌로 실패시 무시

      // 안넣을것들 삭제
      const {
        option,
        dateExpire,
        dateOptionExpire,
        coloringPrismRange,
        coloringPrismHue,
        coloringPrismSaturation,
        coloringPrismValue,
        presetNo,
        active,
        ...cashEquipOnly
      } = cashEquip;

      try {
        await this.prismaService.cashEquipment.create({
          data: cashEquipOnly,
        });
      } catch (e) {
        if (e.code === 'P2002') continue;
        throw e;
      }
    }
  }
}
