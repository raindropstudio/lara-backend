import { Injectable, Logger } from '@nestjs/common';
import { AbilityDto } from 'src/common/dto/ability.dto';
import { CharacterBasicDto } from 'src/common/dto/character-basic.dto';
import { CharacterDto } from 'src/common/dto/character.dto';
import { HyperStatPresetDto } from 'src/common/dto/hyper-stat.dto';
import { ItemEquipmentPresetDto } from 'src/common/dto/item-equipment.dto';
import { PropensityDto } from 'src/common/dto/propensity.dto';
import { StatDto } from 'src/common/dto/stat.dto';
import { removeNulls } from 'src/common/util/removeNulls';
import { NxapiService } from 'src/nxapi/nxapi.service';
import { AbilityRepository } from './repository/ability.repository';
import { CharacterRepository } from './repository/character.repository';
import { HyperStatRepository } from './repository/hyper-stat.repository';
import { ItemEquipmentRepository } from './repository/item-equipment.repository';

@Injectable()
export class CharacterService {
  constructor(
    private readonly nxapiService: NxapiService,
    private readonly characterRepository: CharacterRepository,
    private readonly hyperStatRepository: HyperStatRepository,
    private readonly abilityRepository: AbilityRepository,
    private readonly itemEquipmentRepository: ItemEquipmentRepository,
  ) {}
  private readonly logger = new Logger(CharacterService.name);

  async getCharacterOverall(nickname: string, update?: boolean): Promise<CharacterDto> {
    const character = await this.characterRepository.findCharacterOverallByNickname(nickname);
    if (update || !character) {
      const ocid = await this.nxapiService.fetchCharacterOcid(nickname);

      const [basic, stat, hyperStatPreset, propensity, ability, itemEquipmentPreset] = await Promise.all([
        this.fetchCharacterBasic(ocid),
        this.fetchCharacterStat(ocid),
        this.getCharacterHyperStat(ocid),
        this.fetchCharacterPropensity(ocid),
        this.getCharacterAbility(ocid),
        this.getCharacterItemEquipment(ocid),
      ]);

      const updatedCharacter: CharacterDto = {
        ...character,
        ...basic,
        stat,
        hyperStatPreset,
        propensity,
        ability,
        itemEquipmentPreset,
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
}
