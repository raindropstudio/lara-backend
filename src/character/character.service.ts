import { Injectable, Logger } from '@nestjs/common';
import { AbilityDto } from 'src/common/dto/ability.dto';
import { CashEquipmentPresetDto } from 'src/common/dto/cash-equipment.dto';
import { CharacterBasicDto } from 'src/common/dto/character-basic.dto';
import { CharacterDto } from 'src/common/dto/character.dto';
import { HexaStatDto } from 'src/common/dto/hexa-stat.dto';
import { HyperStatPresetDto } from 'src/common/dto/hyper-stat.dto';
import { ItemEquipmentPresetDto } from 'src/common/dto/item-equipment.dto';
import { CharacterLinkSkillDto } from 'src/common/dto/link-skill.dto';
import { PetEquipmentDataDto } from 'src/common/dto/pet-equipment.dto';
import { PropensityDto } from 'src/common/dto/propensity.dto';
import { SetEffectDto } from 'src/common/dto/set-effect.dto';
import { CharacterSkillCoreDto } from 'src/common/dto/skill-core.dto';
import { CharacterSkillDto } from 'src/common/dto/skill.dto';
import { StatDto } from 'src/common/dto/stat.dto';
import { SymbolDto } from 'src/common/dto/symbol.dto';
import { UnionDto } from 'src/common/dto/union.dto';
import { removeNulls } from 'src/common/util/remove-nulls';
import { NxapiService } from 'src/nxapi/nxapi.service';
import { convertCashEquipmentToEntity } from './converter/cash-equipment.converter';
import { AbilityRepository } from './repository/ability.repository';
import { CashEquipmentRepository } from './repository/cash-equipment.repository';
import { CharacterRepository } from './repository/character.repository';
import { HexaStatRepository } from './repository/hexa-stat.repository';
import { HyperStatRepository } from './repository/hyper-stat.repository';
import { ItemEquipmentRepository } from './repository/item-equipment.repository';
import { ItemOptionRepository } from './repository/item-option.repository';
import { LinkSkillRepository } from './repository/link-skill.repository';
import { SetEffectRepository } from './repository/set-effect.repository';
import { SkillCoreRepository } from './repository/skill-core.repository';
import { SkillRepository } from './repository/skill.repository';

@Injectable()
export class CharacterService {
  constructor(
    private readonly nxapiService: NxapiService,
    private readonly characterRepository: CharacterRepository,
    private readonly hyperStatRepository: HyperStatRepository,
    private readonly abilityRepository: AbilityRepository,
    private readonly itemOptionRepository: ItemOptionRepository,
    private readonly itemEquipmentRepository: ItemEquipmentRepository,
    private readonly cashEquipmentRepository: CashEquipmentRepository,
    private readonly setEffectRepository: SetEffectRepository,
    private readonly skillRepository: SkillRepository,
    private readonly linkSkillRepository: LinkSkillRepository,
    private readonly skillCoreRepository: SkillCoreRepository,
    private readonly hexaStatRepository: HexaStatRepository,
  ) {}
  private readonly logger = new Logger(CharacterService.name);

  async getCharacterOverall(nickname: string, update?: boolean): Promise<CharacterDto> {
    const character = await this.characterRepository.findCharacterOverallByNickname(nickname);
    if (update || !character) {
      const ocid = await this.nxapiService.fetchCharacterOcid(nickname);

      const [
        basic,
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
        hexaStat,
      ] = await Promise.all([
        this.fetchCharacterBasic(ocid),
        this.fetchCharacterStat(ocid),
        this.getCharacterHyperStat(ocid),
        this.fetchCharacterPropensity(ocid),
        this.getCharacterAbility(ocid),
        this.getCharacterItemEquipment(ocid),
        this.getCharacterCashitemEquipment(ocid),
        this.fetchCharacterSymbol(ocid),
        this.getCharacterSetEffect(ocid),
        this.getCharacterPetEquipment(ocid),
        this.fetchUnion(ocid),
        this.getCharacterSkill(ocid),
        this.getCharacterLinkSkill(ocid),
        this.getCharacterSkillCore(ocid),
        this.getCharacterHexaStat(ocid),
      ]);

      const updatedCharacter: CharacterDto = {
        ...character,
        ...basic,
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
        hexaStat,
      };

      await this.characterRepository.upsertCharacterOverall(updatedCharacter);
      return removeNulls(updatedCharacter);
    }
    return removeNulls(character);
  }

  async fetchCharacterBasic(ocid: string, date?: string): Promise<CharacterBasicDto> {
    const baiscPromise = this.nxapiService.fetchCharacterBasic(ocid, date);
    const popularityPromise = this.nxapiService.fetchCharacterPopularity(ocid, date);

    const [basicDto, popularity] = await Promise.all([baiscPromise, popularityPromise]);
    basicDto.popularity = popularity;

    return basicDto;
  }

  async fetchCharacterStat(ocid: string, date?: string): Promise<StatDto> {
    return await this.nxapiService.fetchCharacterStat(ocid, date);
  }

  async getCharacterHyperStat(ocid: string, date?: string): Promise<HyperStatPresetDto[]> {
    const characterHyperStat = await this.nxapiService.fetchCharacterHyperStat(ocid, date);

    // 하이퍼스탯 테이블 업데이트
    await this.hyperStatRepository.createOrIgnoreHyperstat(characterHyperStat);

    return characterHyperStat;
  }

  async fetchCharacterPropensity(ocid: string, date?: string): Promise<PropensityDto> {
    return await this.nxapiService.fetchCharacterPropensity(ocid, date);
  }

  async getCharacterAbility(ocid: string, date?: string): Promise<AbilityDto> {
    const characterAbility = await this.nxapiService.fetchCharacterAbility(ocid, date);

    await this.abilityRepository.createOrIgnoreAbility(characterAbility);

    return characterAbility;
  }

  async getCharacterItemEquipment(ocid: string, date?: string): Promise<ItemEquipmentPresetDto[]> {
    const characterItemEquipment = await this.nxapiService.fetchCharacterItemEquipment(ocid, date);

    await this.itemEquipmentRepository.createOrIgnoreItemEquipment(characterItemEquipment);

    return characterItemEquipment;
  }

  async getCharacterCashitemEquipment(ocid: string, date?: string): Promise<CashEquipmentPresetDto[]> {
    const characterCashItemEquipment = await this.nxapiService.fetchCharacterCashitemEquipment(ocid, date);

    const flattenCashEquipment = convertCashEquipmentToEntity(characterCashItemEquipment);
    await this.itemOptionRepository.createOrIgnoreItemOption(
      flattenCashEquipment.flatMap((item) => item?.option).filter((option) => option),
    );
    await this.cashEquipmentRepository.createOrIgnoreCashEquipment(characterCashItemEquipment);

    return characterCashItemEquipment;
  }

  async fetchCharacterSymbol(ocid: string, date?: string): Promise<SymbolDto[]> {
    return await this.nxapiService.fetchCharacterSymbolEquipment(ocid, date);
  }

  async getCharacterSetEffect(ocid: string, date?: string): Promise<SetEffectDto[]> {
    const characterSetEffect = await this.nxapiService.fetchCharacterSetEffect(ocid, date);

    await this.setEffectRepository.createOrIgnoreSetEffect(characterSetEffect);

    return characterSetEffect;
  }

  async getCharacterPetEquipment(ocid: string, date?: string): Promise<PetEquipmentDataDto[]> {
    const characterPetEquipment = await this.nxapiService.fetchCharacterPetEquipment(ocid, date);

    return characterPetEquipment;
  }

  async getCharacterSkill(ocid: string, date?: string): Promise<CharacterSkillDto[]> {
    const characterVSkill = await this.nxapiService.fetchCharacterSkill(ocid, '5', date);
    const characterHexaSkill = await this.nxapiService.fetchCharacterSkill(ocid, '6', date);

    await this.skillRepository.createOrIgnoreSkill([...characterVSkill, ...characterHexaSkill]);

    return [...characterVSkill, ...characterHexaSkill];
  }

  async getCharacterLinkSkill(ocid: string, date?: string): Promise<CharacterLinkSkillDto[]> {
    const characterLinkSkill = await this.nxapiService.fetchCharacterLinkSkill(ocid, date);

    await this.linkSkillRepository.createOrIgnoreLinkSkill(characterLinkSkill);

    return characterLinkSkill;
  }

  async getCharacterSkillCore(ocid: string, date?: string): Promise<CharacterSkillCoreDto[]> {
    const characterVSkillCore = await this.nxapiService.fetchCharacterVmatrix(ocid, date);
    const characterHexaSkillCore = await this.nxapiService.fetchCharacterHexamatrix(ocid, date);

    await this.skillCoreRepository.createOrIgnoreSkillCore([...characterVSkillCore, ...characterHexaSkillCore]);

    return [...characterVSkillCore, ...characterHexaSkillCore];
  }

  async getCharacterHexaStat(ocid: string, date?: string): Promise<HexaStatDto[]> {
    const characterHexaStat = await this.nxapiService.fetchCharacterHexamatrixStat(ocid, date);

    await this.hexaStatRepository.createOrIgnoreHexaStat(characterHexaStat);

    return characterHexaStat;
  }

  async fetchUnion(ocid: string, date?: string): Promise<UnionDto | null> {
    return await this.nxapiService.fetchUnion(ocid, date);
  }
}
