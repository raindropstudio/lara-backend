import { Injectable, Logger } from '@nestjs/common';
import { NxapiService } from 'src/nxapi/nxapi.service';
import { characterBasicMapper } from './mapper/character-basic.mapper';
import { characterStatMapper } from './mapper/character-stat.mapper';
import { CharacterRepository } from './repository/character.repository';
import { CharacterBasic } from './type/character-basic.type';
import { CharacterStat } from './type/character-stat.type';
import { Character } from './type/character.type';
import { CharacterHyperStat } from './type/character-hyper-stat.type';
import { characterHyperStatMapper } from './mapper/character-hyper-stat.mapper';
import { characterPropensityMapper } from './mapper/character-propensity.mapper';
import { CharacterPropensity } from './type/character-propensity.type';

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

  //? 현재 구현상 과거 데이터 요청시 DB에 저장하지 않음
  async getCharacterOverall(nickname: string, date?: string, update?: boolean): Promise<Character> {
    const character = await this.characterRepository.findCharacterOverallByNickname(nickname);

    if (update || !character) {
      const ocid = await this.getCharacterOcid(nickname);

      const promises = [
        this.fetchCharacterBasic(ocid, date),
        this.fetchCharacterStat(ocid, date),
        this.fetchCharacterHyperStat(ocid, date),
        this.fetchCharacterPropensity(ocid, date),
      ];
      const [basic, stat, hyperStat, propensity] = (await Promise.all(promises)) as [
        CharacterBasic,
        CharacterStat[],
        CharacterHyperStat[],
        CharacterPropensity,
      ];

      const updatedCharacter = {
        ...character,
        ...basic,
        stat,
        hyperStat,
        propensity,
      };

      // DB보다 과거 데이터를 요청한 경우, DB에 저장하지 않음
      if (date && character && character.updatedAt > new Date(date)) {
        return updatedCharacter;
      }

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

  async fetchCharacterStat(ocid: string, date?: string): Promise<CharacterStat[]> {
    const stat = await this.nxapiService.fetchCharacterStat(ocid, date);

    return characterStatMapper(stat);
  }

  async fetchCharacterHyperStat(ocid: string, date?: string): Promise<CharacterHyperStat[]> {
    const hyperStat = await this.nxapiService.fetchCharacterHyperStat(ocid, date);

    return characterHyperStatMapper(hyperStat);
  }

  async fetchCharacterPropensity(ocid: string, date?: string) {
    const propensity = await this.nxapiService.fetchCharacterPropensity(ocid, date);

    return characterPropensityMapper(propensity);
  }
}
