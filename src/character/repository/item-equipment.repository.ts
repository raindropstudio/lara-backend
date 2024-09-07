import { Injectable } from '@nestjs/common';
import { ItemEquipmentInfoDto, ItemEquipmentPresetDto, ItemOptionDto } from 'src/common/dto/item-equipment.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { convertItemEquipmentToEntity } from '../converter/item-equipment.converter';

@Injectable()
export class ItemEquipmentRepository {
  constructor(private readonly prismaService: PrismaService) {}

  private async createOrIgnoreItemOption(itemOptions: ItemOptionDto[]) {
    const uniqueItemOptions = Array.from(new Map(itemOptions.map((io) => [io.hash, io])).values());

    const existingItemOptions = await this.prismaService.itemOption.findMany({
      where: {
        hash: { in: uniqueItemOptions.map((io) => io.hash) },
      },
      select: { hash: true },
    });

    const newOptions = uniqueItemOptions.filter((io) => !existingItemOptions.some((eio) => eio.hash === io.hash));
    return this.prismaService.itemOption.createMany({
      data: newOptions,
      skipDuplicates: true,
    });
  }

  private async createOrIgnoreItemPotential(itemPotentials: string[]) {
    const uniqueItemPotentials = Array.from(new Set(itemPotentials));

    const existingItemPotentials = await this.prismaService.potential.findMany({
      where: {
        potential: { in: uniqueItemPotentials },
      },
      select: { potential: true },
    });

    const newPotentials = uniqueItemPotentials
      .filter((potential) => !existingItemPotentials.some((eip) => eip.potential === potential))
      .map((potential) => ({ potential }));
    return this.prismaService.potential.createMany({
      data: newPotentials,
      skipDuplicates: true,
    });
  }

  private createOptionConnections = (itemEquipment: ItemEquipmentInfoDto, optionIdMap: Record<string, number>) => {
    const optionTypes = [
      { option: itemEquipment.totalOption, type: 'TOTAL' },
      { option: itemEquipment.baseOption, type: 'BASE' },
      { option: itemEquipment.exceptionalOption, type: 'EXCEPTIONAL' },
      { option: itemEquipment.addOption, type: 'ADD' },
      { option: itemEquipment.etcOption, type: 'ETC' },
      { option: itemEquipment.starforceOption, type: 'STARFORCE' },
    ];

    // 각 옵션별 연결 가능하도록 생성
    return optionTypes
      .filter(({ option }) => option && optionIdMap[option.hash])
      .map(({ option, type }) => ({
        option: {
          connect: {
            id: optionIdMap[option.hash],
          },
        },
        optionType: type as 'TOTAL' | 'BASE' | 'EXCEPTIONAL' | 'ADD' | 'ETC' | 'STARFORCE',
      }));
  };

  private createPotentialConnections = (
    itemEquipment: ItemEquipmentInfoDto,
    potentialIdMap: Record<string, number>,
  ) => {
    const potentialOptions = itemEquipment.potentialOption || [];
    const additionalPotentialOptions = itemEquipment.additionalPotentialOption || [];

    const allPotentials = [
      ...potentialOptions.map((potential, index) => ({ potential, potentialNo: index + 1 })),
      ...additionalPotentialOptions.map((potential, index) => ({ potential, potentialNo: index + 4 })),
    ];

    return allPotentials
      .filter(({ potential }) => potentialIdMap[potential])
      .map(({ potential, potentialNo }) => ({
        potential: {
          connect: {
            id: potentialIdMap[potential],
          },
        },
        potentialNo,
      }));
  };

  async createOrIgnoreItemEquipment(itemEquipment: ItemEquipmentPresetDto[]) {
    const flatItemEquipment = convertItemEquipmentToEntity(itemEquipment);

    // 장비마다의 모든 옵션에 대해 저장
    const flatOption = flatItemEquipment.flatMap((item) => {
      return [
        item?.totalOption,
        item?.baseOption,
        item?.exceptionalOption,
        item?.addOption,
        item?.etcOption,
        item?.starforceOption,
      ].filter(Boolean);
    });
    await this.createOrIgnoreItemOption(flatOption);

    // 잠재능력
    const flatPotential = flatItemEquipment.flatMap((item) => {
      return [...(item?.potentialOption ?? []), ...(item?.additionalPotentialOption ?? [])].filter(Boolean);
    });
    await this.createOrIgnoreItemPotential(flatPotential);

    // 장비 저장
    for (const itemEquip of flatItemEquipment) {
      // 장비 해시 존재 여부 확인
      const existingItemEquipment = await this.prismaService.itemEquipment.findUnique({
        where: { hash: itemEquip.hash },
      });

      // 이미 존재하는 장비라면 넘어감
      if (existingItemEquipment) continue;

      // 장비 옵션 해시만 필터링
      const optionHashes = [
        itemEquip.totalOption?.hash,
        itemEquip.baseOption?.hash,
        itemEquip.exceptionalOption?.hash,
        itemEquip.addOption?.hash,
        itemEquip.etcOption?.hash,
        itemEquip.starforceOption?.hash,
      ].filter(Boolean);

      const optionIds = await this.prismaService.itemOption.findMany({
        where: { hash: { in: optionHashes } },
        select: { id: true, hash: true },
      });

      // 잠재능력 해시만 필터링
      const potentialHashes = [...itemEquip.potentialOption, ...itemEquip.additionalPotentialOption].filter(Boolean);

      const potentialIds = await this.prismaService.potential.findMany({
        where: { potential: { in: potentialHashes } },
        select: { id: true, potential: true },
      });

      // 옵션, 잠재 해시랑 ID 매핑
      const optionIdMap = Object.fromEntries(optionIds.map((option) => [option.hash, option.id]));
      const potentialIdMap = Object.fromEntries(potentialIds.map((potential) => [potential.potential, potential.id]));

      // 연결 생성준비
      const optionConnections = this.createOptionConnections(itemEquip, optionIdMap);
      const potentialConnections = this.createPotentialConnections(itemEquip, potentialIdMap);

      // 장비 생성, 단 고유키 충돌로 실패시 무시

      // 옵션, 잠재능력값, 안넣을것 삭제
      const {
        totalOption,
        baseOption,
        exceptionalOption,
        addOption,
        etcOption,
        starforceOption,
        potentialOption,
        additionalPotentialOption,
        presetNo,
        active,
        ...itemEquipWithoutOption
      } = itemEquip;

      try {
        await this.prismaService.itemEquipment.create({
          data: {
            ...itemEquipWithoutOption,
            ItemEquipmentOption: {
              create: optionConnections,
            },
            ItemEquipmentPotential: {
              create: potentialConnections,
            },
          },
        });
      } catch (e) {
        if (e.code === 'P2002') continue;
        throw e;
      }
    }
  }
}
