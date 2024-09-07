import { Injectable } from '@nestjs/common';
import { CharacterDto } from 'src/common/dto/character.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { convertAbilityToDto, convertAbilityToEntity } from '../converter/ability.converter';
import { convertHyperStatToDto, convertHyperStatToEntity } from '../converter/hyper-stat.converter';
import { convertItemEquipmentToDto, convertItemEquipmentToEntity } from '../converter/item-equipment.converter';

@Injectable()
export class CharacterRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findCharacterOverallByNickname(nickname: string): Promise<CharacterDto> {
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

    //? 원래도 이거 안빼면 upsert 오류났었나..?
    const { id, statId, propensityId, abilityPreset, ...characterBasic } = characterData;

    return {
      ...characterBasic,
      hyperStatPreset: convertHyperStatToDto(characterData.hyperStatPreset),
      ability: convertAbilityToDto(characterData.abilityPreset),
      itemEquipmentPreset: convertItemEquipmentToDto(characterData.itemEquipmentPreset),
    };
  }

  async upsertCharacterOverall(character: CharacterDto) {
    const {
      stat,
      hyperStatPreset,
      propensity,
      ability,
      itemEquipmentPreset: characterItemEquipmentList,
      ...characterBasic
    } = character;

    // 0. 하이퍼스탯, 어빌리티, 장비 데이터 flatten, 상위 데이터 적절히 삽입
    const flatHyperStat = convertHyperStatToEntity(hyperStatPreset);
    const flatAbility = convertAbilityToEntity(ability);
    const flatItemEquipment = convertItemEquipmentToEntity(characterItemEquipmentList);

    // 1. 트랜잭션 밖에서 필요한 ID를 고유값을 사용해 한 번에 조회
    const [hyperStatIds, abilityIds, itemEquipmentIds] = await Promise.all([
      // HyperStat IDs 조회
      this.prismaService.hyperStat.findMany({
        where: {
          OR: flatHyperStat.map((hs) => ({
            statType: hs.statType,
            statPoint: hs.statPoint,
          })),
        },
        select: { id: true, statType: true, statPoint: true },
      }),

      // Ability IDs 조회
      this.prismaService.ability.findMany({
        where: {
          abilityValue: { in: flatAbility.map((ab) => ab.abilityValue) },
        },
        select: { id: true, abilityValue: true },
      }),

      // ItemEquipment IDs 조회
      this.prismaService.itemEquipment.findMany({
        where: {
          hash: { in: flatItemEquipment.map((eq) => eq.hash) },
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
        data: flatHyperStat
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
        data: flatAbility
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
        data: flatItemEquipment
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
