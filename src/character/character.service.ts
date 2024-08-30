import { Injectable, Logger } from '@nestjs/common';
import { NxapiService } from 'src/nxapi/nxapi.service';
import { characterAbilityMapper } from './mapper/character-ability.mapper';
import { characterBasicMapper } from './mapper/character-basic.mapper';
import { characterHyperStatMapper } from './mapper/character-hyper-stat.mapper';
import { characterItemEquipmentMapper } from './mapper/character-item-equipment.mapper';
import { characterPropensityMapper } from './mapper/character-propensity.mapper';
import { characterStatMapper } from './mapper/character-stat.mapper';
import { CharacterRepository } from './repository/character.repository';
import { CharacterAbility } from './type/character-ability.type';
import { CharacterBasic } from './type/character-basic.type';
import { CharacterHyperStat } from './type/character-hyper-stat.type';
import { CharacterItemEquipment } from './type/character-item-equipment.type';
import { CharacterPropensity } from './type/character-propensity.type';
import { CharacterStat } from './type/character-stat.type';
import { Character } from './type/character.type';

@Injectable()
export class CharacterService {
  constructor(
    private readonly nxapiService: NxapiService,
    private readonly characterRepository: CharacterRepository,
  ) {}
  private readonly logger = new Logger(CharacterService.name);

  private async getCharacterOcid(characterName: string): Promise<string> {
    return this.nxapiService.fetchCharacterOcid(characterName);
  }

  async getCharacterOverall(nickname: string, update?: boolean): Promise<Character> {
    const character = await this.characterRepository.findCharacterOverallByNickname(nickname);

    if (update || !character) {
      const ocid = await this.getCharacterOcid(nickname);

      const promises = [
        this.fetchCharacterBasic(ocid),
        this.fetchCharacterStat(ocid),
        this.getCharacterHyperStat(ocid),
        this.fetchCharacterPropensity(ocid),
        this.getCharacterAbility(ocid),
        this.getCharacterItemEquipment(ocid),
      ];
      const [basic, stat, hyperStat, propensity, ability, itemEquipment] = (await Promise.all(promises)) as [
        CharacterBasic,
        CharacterStat,
        CharacterHyperStat[],
        CharacterPropensity,
        CharacterAbility[],
        CharacterItemEquipment[],
      ];

      const updatedCharacter: Character = {
        ...character,
        ...basic,
        stat,
        hyperStat,
        propensity,
        ability,
        itemEquipment,
      };

      await this.characterRepository.upsertCharacterOverall(updatedCharacter);
      return updatedCharacter;
    }
    return character;
  }

  async fetchCharacterBasic(ocid: string, date?: string): Promise<CharacterBasic> {
    const baiscPromise = this.nxapiService.fetchCharacterBasic(ocid, date);
    const popularityPromise = this.nxapiService.fetchCharacterPopularity(ocid, date);

    const [basicData, popularityData] = await Promise.all([baiscPromise, popularityPromise]);

    return characterBasicMapper(ocid, basicData, popularityData);
  }

  async fetchCharacterStat(ocid: string, date?: string): Promise<CharacterStat> {
    const stat = await this.nxapiService.fetchCharacterStat(ocid, date);

    return characterStatMapper(stat);
  }

  async getCharacterHyperStat(ocid: string, date?: string): Promise<CharacterHyperStat[]> {
    const rawHyperStat = await this.nxapiService.fetchCharacterHyperStat(ocid, date);

    const characterHyperStat = characterHyperStatMapper(rawHyperStat);

    // 하이퍼스탯 테이블 업데이트
    const flatHyperStat = characterHyperStat.flatMap((hyperStat) => hyperStat.hyperStat);
    await this.characterRepository.createOrIgnoreHyperstat(flatHyperStat);

    return characterHyperStat;
  }

  async fetchCharacterPropensity(ocid: string, date?: string) {
    const propensity = await this.nxapiService.fetchCharacterPropensity(ocid, date);

    return characterPropensityMapper(propensity);
  }

  async getCharacterAbility(ocid: string, date?: string): Promise<CharacterAbility[]> {
    const ability = await this.nxapiService.fetchCharacterAbility(ocid, date);

    const characterAbility = characterAbilityMapper(ability);

    const flatAbility = characterAbility.flatMap((ability) => ability.ability);
    await this.characterRepository.createOrIgnoreAbility(flatAbility);

    return characterAbility;
  }

  async getCharacterItemEquipment(ocid: string, date?: string): Promise<CharacterItemEquipment[]> {
    const itemEquipmentData = await this.nxapiService.fetchCharacterItemEquipment(ocid, date);

    const characterItemEquipment = characterItemEquipmentMapper(itemEquipmentData);

    const flatItemEquipment = characterItemEquipment.flatMap((itemEquipment) => itemEquipment.itemEquipment);
    await this.characterRepository.createOrIgnoreItemEquipment(flatItemEquipment);

    return characterItemEquipment;
  }
}
