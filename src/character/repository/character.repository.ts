import { Injectable } from '@nestjs/common';
import { removeNulls } from 'src/util/removeNulls';
import { PrismaService } from '../../prisma/prisma.service';
import { AbilityInfo, CharacterAbility } from '../type/character-ability.type';
import { HyperStatInfo } from '../type/character-hyper-stat.type';
import { ItemEquipmentInfo, ItemOption } from '../type/character-item-equipment.type';
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
        hyperStatPreset: {
          include: {
            hyperStat: true,
          },
        },
        propensity: true,
        abilityPreset: {
          include: {
            ability: true,
          },
        },
        itemEquipmentPreset: {
          include: {
            itemEquipment: {
              include: {
                ItemEquipmentOption: {
                  include: {
                    option: true,
                  },
                },
                ItemEquipmentPotential: {
                  include: {
                    potential: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!characterData) return null;

    const hyperStatPresets = [
      { presetNo: 1, active: false, remainPoint: 0, hyperStatInfo: [] },
      { presetNo: 2, active: false, remainPoint: 0, hyperStatInfo: [] },
      { presetNo: 3, active: false, remainPoint: 0, hyperStatInfo: [] },
    ];

    const abilityPresets: CharacterAbility = {
      remainFame: 0, // preset 0번의 abilityNo 값
      preset: [
        { presetNo: 1, active: false, abilityInfo: [] },
        { presetNo: 2, active: false, abilityInfo: [] },
        { presetNo: 3, active: false, abilityInfo: [] },
      ],
    };

    const itemEquipmentPresets = [
      { presetNo: 1, active: false, itemEquipmentInfo: [] },
      { presetNo: 2, active: false, itemEquipmentInfo: [] },
      { presetNo: 3, active: false, itemEquipmentInfo: [] },
      { presetNo: 4, active: false, itemEquipmentInfo: [] }, // 타이틀
      { presetNo: 5, active: false, itemEquipmentInfo: [] }, // 드래곤 or 메카닉 장비
    ];

    // 2. 하이퍼스탯 데이터를 프리셋별로 그룹화
    if (characterData.hyperStatPreset) {
      characterData.hyperStatPreset.forEach((hs) => {
        const preset = hyperStatPresets.find((p) => p.presetNo === hs.presetNo);
        if (preset) {
          preset.active = hs.active; // 활성화 여부 설정
          if (hs.hyperStat.statType === '_REMAIN_POINT') {
            preset.remainPoint = hs.hyperStat.statPoint;
          } else {
            preset.hyperStatInfo.push(hs.hyperStat);
          }
        }
      });
    }

    // 3. 어빌리티 데이터를 프리셋별로 그룹화
    if (characterData.abilityPreset) {
      characterData.abilityPreset.forEach((ab) => {
        if (ab.presetNo === 0) {
          abilityPresets.remainFame = ab.abilityNo;
        }

        const preset = abilityPresets.preset.find((p) => p.presetNo === ab.presetNo);
        if (preset) {
          preset.active = ab.active; // 활성화 여부 설정
          preset.abilityInfo.push({
            abilityNo: ab.abilityNo,
            abilityGrade: ab.ability.abilityGrade,
            abilityValue: ab.ability.abilityValue,
          });
        }
      });
    }

    // 4. 장비 데이터를 프리셋별로 그룹화
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
        ];
      }
      if (itemEquipment.additionalPotentialOptionGrade) {
        res['additionalPotentialOption'] = [
          getPotentialText(itemEquipment, 4),
          getPotentialText(itemEquipment, 5),
          getPotentialText(itemEquipment, 6),
        ];
      }
      return res;
    };

    const getOption = (itemEquipment, optionType: 'TOTAL' | 'BASE' | 'EXCEPTIONAL' | 'ADD' | 'ETC' | 'STARFORCE') => {
      return itemEquipment.ItemEquipmentOption.find((option) => option.optionType === optionType)?.option;
    };

    if (characterData.itemEquipmentPreset) {
      characterData.itemEquipmentPreset.forEach((eq) => {
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
    }

    //? 원래도 이거 안빼면 upsert 오류났었나..?
    const { id, statId, propensityId, ...characterBasic } = characterData;

    const res = {
      ...characterBasic,
      hyperStatPreset: characterData.hyperStatPreset ? hyperStatPresets : null,
      ability: characterData.abilityPreset ? abilityPresets : null,
      itemEquipmentPreset: characterData.itemEquipmentPreset ? itemEquipmentPresets : null,
    };

    return removeNulls(res);
  }

  async createOrIgnoreHyperstat(hyperStats: HyperStatInfo[]) {
    return this.prismaService.hyperStat.createMany({
      data: hyperStats,
      skipDuplicates: true,
    });
  }

  async createOrIgnoreAbility(ability: AbilityInfo[]) {
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

  private createOptionConnections = (itemEquipment: ItemEquipmentInfo, optionIdMap: Record<string, number>) => {
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

  private createPotentialConnections = (itemEquipment: ItemEquipmentInfo, potentialIdMap: Record<string, number>) => {
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

  async createOrIgnoreItemEquipment(itemEquipment: ItemEquipmentInfo[]) {
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
      hyperStatPreset: characterHyperStatList,
      propensity,
      ability: characterAbilityList,
      itemEquipmentPreset: characterItemEquipmentList,
      ...characterBasic
    } = character;

    // 0. 하이퍼스탯, 어빌리티, 장비 데이터 flatten, 상위 데이터 적절히 삽입
    const hyperStat = characterHyperStatList.flatMap((hs) => {
      return hs.hyperStatInfo.map((h) => ({
        ...h,
        presetNo: hs.presetNo,
        active: hs.active,
      }));
    });
    const ability = characterAbilityList.preset.flatMap((ab) => {
      return ab.abilityInfo.map((a) => ({
        ...a,
        presetNo: ab.presetNo,
        active: ab.active,
      }));
    });
    const itemEquipment = characterItemEquipmentList.flatMap((eq) => {
      return eq.itemEquipmentInfo.map((e) => ({
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
            statPoint: hs.statPoint,
          })),
        },
        select: { id: true, statType: true, statPoint: true },
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
    const hyperStatMap = new Map(hyperStatIds.map((hs) => [`${hs.statType}_${hs.statPoint}`, hs.id]));
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

      // 기존 연결된 하이퍼스탯, 어빌리티, 장비 삭제
      await prisma.characterHyperStat.deleteMany({
        where: { characterId },
      });
      await prisma.characterAbility.deleteMany({
        where: { characterId },
      });
      await prisma.characterItemEquipment.deleteMany({
        where: { characterId },
      });

      // 하이퍼스탯 중간 테이블 연결
      await prisma.characterHyperStat.createMany({
        data: hyperStat
          .filter((hs) => hyperStatMap.has(`${hs.statType}_${hs.statPoint}`)) // 존재하는 ID만 사용
          .map((hs) => ({
            characterId: characterId,
            hyperStatId: hyperStatMap.get(`${hs.statType}_${hs.statPoint}`),
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
