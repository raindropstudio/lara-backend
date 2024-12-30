import { Injectable } from '@nestjs/common';
import { CharacterDto } from 'src/common/dto/character.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { convertAbilityToDto, convertAbilityToEntity } from '../converter/ability.converter';
import { convertCashEquipmentToDto, convertCashEquipmentToEntity } from '../converter/cash-equipment.converter';
import { convertHyperStatToDto, convertHyperStatToEntity } from '../converter/hyper-stat.converter';
import { convertItemEquipmentToDto, convertItemEquipmentToEntity } from '../converter/item-equipment.converter';
import { convertLinkSkillToDto, convertLinkSkillToEntity } from '../converter/link-skill.converter';
import { convertPetEquipmentToDto, convertPetEquipmentToEntity } from '../converter/pet-equipment.converter';
import { convertSetEffectToDto } from '../converter/set-effect.converter';
import { convertSkillCoreToDto } from '../converter/skill-core.converter';
import { convertSkillToDto } from '../converter/skill.converter';

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
        petEquipment: true,
        union: true,
        skill: {
          include: {
            skill: true,
          },
        },
        linkSkill: {
          include: {
            skill: true,
          },
        },
        skillCore: {
          include: {
            skillCore: true,
          },
        },
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
      petEquipment: convertPetEquipmentToDto(characterData.petEquipment),
      skill: convertSkillToDto(characterData.skill),
      linkSkill: convertLinkSkillToDto(characterData.linkSkill),
      skillCore: convertSkillCoreToDto(characterData.skillCore),
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
      skill,
      linkSkill,
      skillCore,
      ...characterData
    } = character;

    // 0. 따로 처리할 데이터 flatten, 상위 데이터 적절히 삽입
    const flatHyperStat = convertHyperStatToEntity(hyperStatPreset);
    const flatAbility = convertAbilityToEntity(ability);
    const flatItemEquipment = convertItemEquipmentToEntity(itemEquipmentPreset);
    const flatCashEquipment = convertCashEquipmentToEntity(cashEquipmentPreset);
    const cashOption = flatCashEquipment.map((eq) => eq.option).filter((opt) => opt);
    const flatLinkSkill = convertLinkSkillToEntity(linkSkill);

    // 1. 트랜잭션 밖에서 필요한 ID를 고유값을 사용해 한 번에 조회
    const [
      hyperStatIds,
      abilityIds,
      itemEquipmentIds,
      cashEquipmentIds,
      cashEquipOptionIds,
      setEffectIds,
      skillIds,
      skillCoreIds,
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

      // Skill IDs 조회
      this.prismaService.skill.findMany({
        where: {
          hash: {
            in: [
              ...skill.map((s) => s.hash),
              ...linkSkill.flatMap((ls) => [ls.ownedSkill.hash, ...ls.skill.map((s) => s.hash)]),
            ],
          },
        },
        select: { id: true, hash: true },
      }),

      // SkillCore IDs 조회
      this.prismaService.skillCore.findMany({
        where: {
          hash: { in: skillCore.map((sc) => sc.skillCore.hash) },
        },
        select: { id: true, hash: true },
      }),
    ]);

    // 2. ID들을 조회한 결과에 따라 매핑하여 삽입할 데이터 준비
    const hyperStatMap = new Map(hyperStatIds.map((hs) => [`${hs.statType}_${hs.statPoint}`, hs.id]));
    const abilityMap = new Map(abilityIds.map((ab) => [ab.abilityValue, ab.id]));
    const itemEquipmentMap = new Map(itemEquipmentIds.map((eq) => [eq.hash, eq.id]));
    const cashEquipmentMap = new Map(cashEquipmentIds.map((eq) => [eq.icon, eq.id]));
    const cashEquipOptionMap = new Map(cashEquipOptionIds.map((opt) => [opt.hash, opt.id]));
    const setEffectMap = new Map(setEffectIds.map((setEff) => [setEff.setName, setEff.id]));
    const skillMap = new Map(skillIds.map((s) => [s.hash, s.id]));
    const skillCoreMap = new Map(skillCoreIds.map((sc) => [sc.hash, sc.id]));

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
          petEquipment: {
            deleteMany: {},
            create: petEquipment.map(convertPetEquipmentToEntity),
          },
        },
        create: {
          ...characterBasic,
          stat: { create: stat },
          propensity: { create: propensity },
          union: { create: union },
          petEquipment: {
            create: petEquipment.map(convertPetEquipmentToEntity),
          },
        },
      });

      const characterId = upsertedCharacter.id;

      // 기존 연결된 데이터 삭제
      await Promise.all([
        prisma.characterHyperStat.deleteMany({ where: { characterId } }),
        prisma.characterAbility.deleteMany({ where: { characterId } }),
        prisma.characterItemEquipment.deleteMany({ where: { characterId } }),
        prisma.characterCashEquipment.deleteMany({ where: { characterId } }),
        prisma.symbol.deleteMany({ where: { characterId } }),
        prisma.characterSetEffect.deleteMany({ where: { characterId } }),
        prisma.characterSkill.deleteMany({ where: { characterId } }),
        prisma.characterLinkSkill.deleteMany({ where: { characterId } }),
        prisma.characterSkillCore.deleteMany({ where: { characterId } }),
      ]);

      // 하이퍼스탯 중간 테이블 연결
      await prisma.characterHyperStat.createMany({
        data: flatHyperStat
          .filter((hs) => hyperStatMap.has(`${hs.statType}_${hs.statPoint}`))
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

      // 스킬 연결
      await prisma.characterSkill.createMany({
        data: skill
          .filter((s) => skillMap.has(s.hash))
          .map((s) => ({
            characterId: characterId,
            skillId: skillMap.get(s.hash),
          })),
        skipDuplicates: true,
      });

      // 링크스킬 연결
      await prisma.characterLinkSkill.createMany({
        data: flatLinkSkill.map((ls) => ({
          characterId: characterId,
          skillId: skillMap.get(ls.skillHash),
          presetNo: ls.presetNo,
          ownedSkill: ls.ownedSkill,
        })),
        skipDuplicates: true,
      });

      // 스킬코어 연결
      await prisma.characterSkillCore.createMany({
        data: skillCore
          .filter((sc) => skillCoreMap.has(sc.skillCore.hash))
          .map((sc) => ({
            characterId: characterId,
            skillCoreId: skillCoreMap.get(sc.skillCore.hash),
            slotId: sc.slotId,
            slotLevel: sc.slotLevel,
            coreLevel: sc.coreLevel,
          })),
        skipDuplicates: true,
      });
    });
  }
}
