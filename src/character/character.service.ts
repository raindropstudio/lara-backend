import { Injectable } from '@nestjs/common';
import { NxapiService } from 'src/nxapi/nxapi.service';
import { characterBasicMapper } from './mapper/character-basic.mapper';
import { CharacterRepository } from './repository/character.repository';
import { CharacterBasic } from './type/character-basic.type';
import { Character } from './type/character.type';

@Injectable()
export class CharacterService {
  constructor(
    private readonly nxapiService: NxapiService,
    private readonly characterRepository: CharacterRepository,
  ) {}

  private async getCharacterOcid(characterName: string): Promise<string> {
    return this.nxapiService.fetchCharacterOcid(characterName);
  }

  //? 현재 구현상 과거 데이터 요청시 DB에 저장하지 않음
  async getCharacterOverall(nickname: string, date?: string, update?: boolean): Promise<Character> {
    const character = await this.characterRepository.findCharacterOverallByNickname(nickname);

    if (update || !character) {
      const ocid = await this.getCharacterOcid(nickname);
      const basic = await this.fetchCharacterBasic(ocid, date);

      const updatedCharacter = {
        ...character,
        ...basic,
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
}
