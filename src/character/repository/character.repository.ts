import { Injectable } from '@nestjs/common';
import { CharacterDto } from 'src/common/dto/character.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { convertAbilityToDto, convertAbilityToEntity } from '../converter/ability.converter';
import { convertCashEquipmentToDto, convertCashEquipmentToEntity } from '../converter/cash-equipment.converter';
import { convertHexaMatrixToDto } from '../converter/hexa-matrix.converter';
import { convertHyperStatToDto, convertHyperStatToEntity } from '../converter/hyper-stat.converter';
import { convertItemEquipmentToDto, convertItemEquipmentToEntity } from '../converter/item-equipment.converter';
import { convertPetEquipmentToDto, convertPetEquipmentToEntity } from '../converter/pet-equipment.converter';
import { convertSetEffectToDto } from '../converter/set-effect.converter';

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
        cashEquipmentPreset: {
          include: {
            cashEquipment: true,
            option: true,
          },
        },
        symbol: true,
        setEffect: {
          include: {
            setEffect: true,
          },
        },
        PetEquipment: true,
        hexaCores: {
          include: {
            core: {
              include: {
                skills: {
                  include: {
                    levelEffects: true,
                  },
                },
              },
            },
          },
        },
        union: true,
      },
    });

    if (!characterData) return null;
    const { abilityPreset, ...character } = characterData;
    return {
      ...character,
      hyperStatPreset: convertHyperStatToDto(characterData.hyperStatPreset),
      ability: convertAbilityToDto(characterData.abilityPreset),
      itemEquipmentPreset: convertItemEquipmentToDto(characterData.itemEquipmentPreset),
      cashEquipmentPreset: convertCashEquipmentToDto(characterData.cashEquipmentPreset),
      setEffect: convertSetEffectToDto(characterData.setEffect),
      petEquipment: convertPetEquipmentToDto(characterData.PetEquipment),
      hexaMatrix: convertHexaMatrixToDto(characterData.hexaCores),
    };
  }

  async upsertCharacterOverall(character: CharacterDto) {
    const {
      stat,
      hyperStatPreset,
      propensity,
      ability,
      itemEquipmentPreset,
      cashEquipmentPreset,
      symbol,
      setEffect,
      petEquipment,
      union,
      hexaMatrix,
      ...characterData
    } = character;

    // 0. 따로 처리할 데이터 flatten, 상위 데이터 적절히 삽입
    const flatHyperStat = convertHyperStatToEntity(hyperStatPreset);
    const flatAbility = convertAbilityToEntity(ability);
    const flatItemEquipment = convertItemEquipmentToEntity(itemEquipmentPreset);
    const flatCashEquipment = convertCashEquipmentToEntity(cashEquipmentPreset);
    const cashOption = flatCashEquipment.map((eq) => eq.option).filter((opt) => opt);

    // 1. 트랜잭션 밖서 필요한 ID를 고유값을 사용해 한 번에 조회
    const [
      hyperStatIds,
      abilityIds,
      itemEquipmentIds,
      cashEquipmentIds,
      cashEquipOptionIds,
      setEffectIds,
      hexaCoreIds,
    ] = await Promise.all([
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

      // CashEquipment IDs 조회
      this.prismaService.cashEquipment.findMany({
        where: {
          icon: { in: flatCashEquipment.map((eq) => eq.icon) },
        },
        select: { id: true, icon: true },
      }),

      // CashEquipment 관련 Option IDs 조회
      this.prismaService.itemOption.findMany({
        where: {
          hash: { in: cashOption.map((opt) => opt.hash) },
        },
        select: { id: true, hash: true },
      }),

      // 세트효과
      this.prismaService.setEffect.findMany({
        where: {
          setName: { in: setEffect.map((setEff) => setEff.setName) },
        },
        select: { id: true, setName: true },
      }),

      // HexaCore IDs 조회
      this.prismaService.hexaCore.findMany({
        where: {
          OR:
            hexaMatrix?.cores?.map((core) => ({
              characterClass: hexaMatrix.characterClass,
              coreName: core.coreName,
            })) ?? [],
        },
        select: {
          id: true,
          characterClass: true,
          coreName: true,
        },
      }),
    ]);

    // Map 생성
    const hexaCoreMap = new Map(hexaCoreIds.map((core) => [`${core.characterClass}_${core.coreName}`, core.id]));

    // 2. ID들을 조회한 결과에 따라 매핑하여 삽입할 데이터 준비
    const hyperStatMap = new Map(hyperStatIds.map((hs) => [`${hs.statType}_${hs.statPoint}`, hs.id]));
    const abilityMap = new Map(abilityIds.map((ab) => [ab.abilityValue, ab.id]));
    const itemEquipmentMap = new Map(itemEquipmentIds.map((eq) => [eq.hash, eq.id]));
    const cashEquipmentMap = new Map(cashEquipmentIds.map((eq) => [eq.icon, eq.id]));
    const cashEquipOptionMap = new Map(cashEquipOptionIds.map((opt) => [opt.hash, opt.id]));
    const setEffectMap = new Map(setEffectIds.map((setEff) => [setEff.setName, setEff.id]));

    // 3. 트랜잭션 내에서 Character와 연결된 항목들을 처리
    await this.prismaService.$transaction(async (prisma) => {
      // Character upsert

      const { id, statId, propensityId, unionId, ...characterBasic } = characterData;

      const upsertedCharacter = await prisma.character.upsert({
        where: { nickname: characterBasic.nickname },
        update: {
          ...characterBasic,
          stat: statId ? { update: stat } : { create: stat },
          propensity: propensityId ? { update: propensity } : { create: propensity },
          union: unionId ? { update: union } : { create: union },
          PetEquipment: {
            deleteMany: {},
            create: petEquipment.map(convertPetEquipmentToEntity),
          },
          hexaCores: {
            deleteMany: {},
            create:
              hexaMatrix?.cores?.map((core) => ({
                hexaCoreId: hexaCoreMap.get(`${hexaMatrix.characterClass}_${core.coreName}`),
                coreLevel: core.coreLevel,
              })) ?? [],
          },
        },
        create: {
          ...characterBasic,
          stat: { create: stat },
          propensity: { create: propensity },
          union: { create: union },
          PetEquipment: {
            create: petEquipment.map(convertPetEquipmentToEntity),
          },
          hexaCores: {
            create:
              hexaMatrix?.cores?.map((core) => ({
                hexaCoreId: hexaCoreMap.get(`${hexaMatrix.characterClass}_${core.coreName}`),
                coreLevel: core.coreLevel,
              })) ?? [],
          },
        },
      });

      const characterId = upsertedCharacter.id;

      // 기존 연결된 하이퍼스탯, 어빌리티, 장비, 펫장비 삭제
      await prisma.characterHyperStat.deleteMany({
        where: { characterId },
      });
      await prisma.characterAbility.deleteMany({
        where: { characterId },
      });
      await prisma.characterItemEquipment.deleteMany({
        where: { characterId },
      });
      await prisma.characterCashEquipment.deleteMany({
        where: { characterId },
      });
      await prisma.symbol.deleteMany({
        where: { characterId },
      });
      await prisma.characterSetEffect.deleteMany({
        where: { characterId },
      });
      await prisma.characterHexaCore.deleteMany({
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
          .filter((ab) => abilityMap.has(ab.abilityValue))
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
          .filter((eq) => itemEquipmentMap.has(eq.hash))
          .map((eq) => ({
            characterId: characterId,
            itemEquipmentId: itemEquipmentMap.get(eq.hash),
            presetNo: eq.presetNo,
            active: eq.active,
          })),
        skipDuplicates: true,
      });

      // 캐시장비 연결
      await prisma.characterCashEquipment.createMany({
        data: flatCashEquipment
          .filter((eq) => cashEquipmentMap.has(eq.icon))
          .map((eq) => ({
            characterId: characterId,
            cashEquipmentId: cashEquipmentMap.get(eq.icon),
            presetNo: eq.presetNo,
            active: eq.active,
            optionId: eq.option ? cashEquipOptionMap.get(eq.option.hash) : null,
            dateExpire: eq.dateExpire,
            dateOptionExpire: eq.dateOptionExpire,
            coloringPrismRange: eq.coloringPrismRange,
            coloringPrismHue: eq.coloringPrismHue,
            coloringPrismSaturation: eq.coloringPrismSaturation,
            coloringPrismValue: eq.coloringPrismValue,
          })),
        skipDuplicates: true,
      });

      // 심볼 생성
      await prisma.symbol.createMany({
        data: symbol.map((sym) => ({
          characterId: characterId,
          ...sym,
        })),
      });

      // 세트효과 생성
      await prisma.characterSetEffect.createMany({
        data: setEffect.map((setEff) => ({
          characterId: characterId,
          setEffectId: setEffectMap.get(setEff.setName),
          setCount: setEff.setCount,
        })),
      });

      // HexaCore 연결 추가
      await prisma.characterHexaCore.createMany({
        data:
          hexaMatrix?.cores?.map((core) => ({
            characterId: characterId,
            hexaCoreId: hexaCoreMap.get(`${hexaMatrix.characterClass}_${core.coreName}`),
            coreLevel: core.coreLevel,
          })) ?? [],
        skipDuplicates: true,
      });
    });
  }
}
