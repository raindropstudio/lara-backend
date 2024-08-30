import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Ability } from '../type/character-ability.type';
import { HyperStat } from '../type/character-hyper-stat.type';
import { ItemEquipment, ItemOption } from '../type/character-item-equipment.type';
import { Character } from '../type/character.type';

@Injectable()
export class CharacterRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findCharacterOverallByNickname(nickname: string): Promise<Character> {
    const characterData = await this.prismaService.character.findUnique({
      where: {
        nickname,
      },
      include: {
        stat: true,
        hyperStat: {
          include: {
            hyperStat: true,
          },
        },
        propensity: true,
        ability: {
          include: {
            ability: true,
          },
        },
        itemEquipment: {
          include: {
            itemEquipment: true,
          },
        },
      },
    });

    if (!characterData) return null;

    const hyperStatPresets = [
      { presetNo: 1, active: false, hyperStat: [] },
      { presetNo: 2, active: false, hyperStat: [] },
      { presetNo: 3, active: false, hyperStat: [] },
    ];

    const abilityPresets = [
      { presetNo: 1, active: false, ability: [] },
      { presetNo: 2, active: false, ability: [] },
      { presetNo: 3, active: false, ability: [] },
    ];

    const itemEquipmentPresets = [
      { presetNo: 1, active: false, itemEquipment: [] },
      { presetNo: 2, active: false, itemEquipment: [] },
      { presetNo: 3, active: false, itemEquipment: [] },
      { presetNo: 4, active: false, itemEquipment: [] }, // 타이틀
      { presetNo: 5, active: false, itemEquipment: [] }, // 드래곤 or 메카닉 장비
    ];

    // 2. 하이퍼스탯 데이터를 프리셋별로 그룹화
    if (characterData.hyperStat) {
      characterData.hyperStat.forEach((hs) => {
        const preset = hyperStatPresets.find((p) => p.presetNo === hs.presetNo);
        if (preset) {
          preset.active = hs.active; // 활성화 여부 설정
          const { presetNo, active, ...rest } = hs; // 프리셋 관련 데이터 제외하고 나머지 가져오기
          preset.hyperStat.push(rest);
        }
      });
    }

    // 3. 어빌리티 데이터를 프리셋별로 그룹화
    if (characterData.ability) {
      characterData.ability.forEach((ab) => {
        const preset = abilityPresets.find((p) => p.presetNo === ab.presetNo);
        if (preset) {
          preset.active = ab.active; // 활성화 여부 설정
          const { presetNo, active, ...rest } = ab; // 프리셋 관련 데이터 제외하고 나머지 가져오기
          preset.ability.push(rest);
        }
      });
    }

    // 4. 장비 데이터를 프리셋별로 그룹화
    if (characterData.itemEquipment) {
      characterData.itemEquipment.forEach((eq) => {
        const preset = itemEquipmentPresets.find((p) => p.presetNo === eq.presetNo);
        if (preset) {
          preset.active = eq.active; // 활성화 여부 설정
          const { presetNo, active, ...rest } = eq; // 프리셋 관련 데이터 제외하고 나머지 가져오기
          preset.itemEquipment.push(rest);
        }
      });
    }

    //? 원래도 이거 안빼면 upsert 오류났었나..?
    const { id, statId, propensityId, ...characterBasic } = characterData;

    return {
      ...characterBasic,
      hyperStat: characterData.hyperStat ? hyperStatPresets : null,
      ability: characterData.ability ? abilityPresets : null,
      itemEquipment: characterData.itemEquipment ? itemEquipmentPresets : null,
    };
  }

  async createOrIgnoreHyperstat(hyperStats: HyperStat[]) {
    return this.prismaService.hyperStat.createMany({
      data: hyperStats,
      skipDuplicates: true,
    });
  }

  async createOrIgnoreAbility(ability: Ability[]) {
    const abilityWithoutNo = ability.map(({ abilityNo, ...rest }) => rest);
    return this.prismaService.ability.createMany({
      data: abilityWithoutNo,
      skipDuplicates: true,
    });
  }

  private async createOrIgnoreItemOption(itemOptions: ItemOption[]) {
    return this.prismaService.itemOption.createMany({
      data: itemOptions,
      skipDuplicates: true,
    });
  }

  private async createOrIgnoreItemPotential(itemPotentials: string[]) {
    return this.prismaService.potential.createMany({
      data: itemPotentials.map((potential) => ({ potential })),
      skipDuplicates: true,
    });
  }

  private createOptionConnections = (itemEquipment: ItemEquipment, optionIdMap: Record<string, number>) => {
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

  private createPotentialConnections = (itemEquipment: ItemEquipment, potentialIdMap: Record<string, number>) => {
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

  async createOrIgnoreItemEquipment(itemEquipment: ItemEquipment[]) {
    // 장비마다의 모든 옵션에 대해 저장
    const flatOption = itemEquipment.flatMap((item) => {
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
    const flatPotential = itemEquipment.flatMap((item) => {
      return [...(item?.potentialOption ?? []), ...(item?.additionalPotentialOption ?? [])].filter(Boolean);
    });
    await this.createOrIgnoreItemPotential(flatPotential);

    // 장비 저장
    for (const itemEquip of itemEquipment) {
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

      // 옵션, 잠재능력값 삭제
      const {
        totalOption,
        baseOption,
        exceptionalOption,
        addOption,
        etcOption,
        starforceOption,
        potentialOption,
        additionalPotentialOption,
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

  async upsertCharacterOverall(character: Character) {
    const {
      stat,
      hyperStat: characterHyperStatList,
      propensity,
      ability: characterAbilityList,
      itemEquipment: characterItemEquipmentList,
      ...characterBasic
    } = character;

    // 0. 하이퍼스탯, 어빌리티, 장비 데이터 flatten, 상위 데이터 적절히 삽입
    const hyperStat = characterHyperStatList.flatMap((hs) => {
      return hs.hyperStat.map((h) => ({
        ...h,
        presetNo: hs.presetNo,
        active: hs.active,
      }));
    });
    const ability = characterAbilityList.flatMap((ab) => {
      return ab.ability.map((a) => ({
        ...a,
        presetNo: ab.presetNo,
        active: ab.active,
      }));
    });
    const itemEquipment = characterItemEquipmentList.flatMap((eq) => {
      return eq.itemEquipment.map((e) => ({
        ...e,
        presetNo: eq.presetNo,
        active: eq.active,
      }));
    });

    // 1. 트랜잭션 밖에서 필요한 ID를 고유값을 사용해 한 번에 조회
    const [hyperStatIds, abilityIds, itemEquipmentIds] = await Promise.all([
      // HyperStat IDs 조회
      this.prismaService.hyperStat.findMany({
        where: {
          OR: hyperStat.map((hs) => ({
            statType: hs.statType,
            statLevel: hs.statLevel,
          })),
        },
        select: { id: true, statType: true, statLevel: true },
      }),

      // Ability IDs 조회
      this.prismaService.ability.findMany({
        where: {
          abilityValue: { in: ability.map((ab) => ab.abilityValue) },
        },
        select: { id: true, abilityValue: true },
      }),

      // ItemEquipment IDs 조회
      this.prismaService.itemEquipment.findMany({
        where: {
          hash: { in: itemEquipment.map((eq) => eq.hash) },
        },
        select: { id: true, hash: true },
      }),
    ]);

    // 2. ID들을 조회한 결과에 따라 매핑하여 삽입할 데이터 준비
    const hyperStatMap = new Map(hyperStatIds.map((hs) => [`${hs.statType}_${hs.statLevel}`, hs.id]));
    const abilityMap = new Map(abilityIds.map((ab) => [ab.abilityValue, ab.id]));
    const itemEquipmentMap = new Map(itemEquipmentIds.map((eq) => [eq.hash, eq.id]));

    // 3. 트랜잭션 내에서 Character와 연결된 항목들을 처리
    await this.prismaService.$transaction(async (prisma) => {
      // Character upsert
      const upsertedCharacter = await prisma.character.upsert({
        where: { nickname: characterBasic.nickname },
        update: {
          ...characterBasic,
          stat: {
            update: stat,
          },
          propensity: {
            update: propensity,
          },
        },
        create: {
          ...characterBasic,
          stat: {
            create: stat,
          },
          propensity: {
            create: propensity,
          },
        },
      });

      const characterId = upsertedCharacter.id;

      // 하이퍼스탯 중간 테이블 연결
      await prisma.characterHyperStat.createMany({
        data: hyperStat
          .filter((hs) => hyperStatMap.has(`${hs.statType}_${hs.statLevel}`)) // 존재하는 ID만 사용
          .map((hs) => ({
            characterId: characterId,
            hyperStatId: hyperStatMap.get(`${hs.statType}_${hs.statLevel}`),
            presetNo: hs.presetNo,
            active: hs.active,
          })),
        skipDuplicates: true,
      });

      // 어빌리티 연결
      await prisma.characterAbility.createMany({
        data: ability
          .filter((ab) => abilityMap.has(ab.abilityValue)) // 존재하는 ID만 사용
          .map((ab) => ({
            characterId: characterId,
            abilityId: abilityMap.get(ab.abilityValue),
            abilityNo: ab.abilityNo,
            presetNo: ab.presetNo,
            active: ab.active,
          })),
        skipDuplicates: true,
      });

      // 장비 연결
      await prisma.characterItemEquipment.createMany({
        data: itemEquipment
          .filter((eq) => itemEquipmentMap.has(eq.hash)) // 존재하는 ID만 사용
          .map((eq) => ({
            characterId: characterId,
            itemEquipmentId: itemEquipmentMap.get(eq.hash),
            presetNo: eq.presetNo,
            active: eq.active,
          })),
        skipDuplicates: true,
      });
    });
  }
}
