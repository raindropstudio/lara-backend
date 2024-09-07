import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import axiosRetry from 'axios-retry';
import { AbilityDto } from 'src/common/dto/ability.dto';
import { CharacterBasicDto } from 'src/common/dto/character-basic.dto';
import { HyperStatPresetDto } from 'src/common/dto/hyper-stat.dto';
import { ItemEquipmentPresetDto } from 'src/common/dto/item-equipment.dto';
import { PropensityDto } from 'src/common/dto/propensity.dto';
import { StatDto } from 'src/common/dto/stat.dto';
import { abilityMapper } from './mapper/ability.mapper';
import { characterBasicMapper } from './mapper/character-basic.mapper';
import { hyperStatMapper } from './mapper/hyper-stat.mapper';
import { itemEquipmentMapper } from './mapper/item-equipment.mapper';
import { propensityMapper } from './mapper/propensity.mapper';
import { statMapper } from './mapper/stat.mapper';
import { NxapiAbilityData } from './type/nxapi-ability.type';
import { NxapiItemEquipment } from './type/nxapi-item-equipment.type';

type SkillGrade = '0' | '1' | '1.5' | '2' | '2.5' | '3' | '4' | '5' | '6' | 'hyperpassive' | 'hyperactive';

@Injectable()
export class NxapiService implements OnModuleInit {
  constructor(private readonly httpService: HttpService) {}
  private readonly logger = new Logger(NxapiService.name);

  onModuleInit() {
    axiosRetry(this.httpService.axiosRef, {
      retries: 3,
      retryDelay: (retryCount) => {
        this.logger.warn(`Retry attempt: ${retryCount}`);
        return retryCount * 1000;
      },
    });
  }

  private async nxapi<T>(url: string, params: { [key: string]: string }): Promise<T> {
    try {
      const res = await this.httpService.axiosRef.get(url, { params });
      return res.data;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async fetchCharacterOcid(characterName: string): Promise<string> {
    const res = await this.nxapi<any>('/id', { character_name: characterName });
    this.logger.log(`fetchCharacterOcid: ${characterName} => ${res.ocid}`);
    return res.ocid;
  }

  async fetchCharacterBasic(ocid: string, date?: string): Promise<CharacterBasicDto> {
    const res = await this.nxapi<any>('/character/basic', { ocid, date });
    this.logger.log(`fetchCharacterBasic: ${ocid.slice(0, 10) + '...'} => ${JSON.stringify(res).slice(0, 50) + '...'}`);
    return characterBasicMapper(ocid, res);
  }

  async fetchCharacterPopularity(ocid: string, date?: string): Promise<number> {
    const res = await this.nxapi<any>('/character/popularity', { ocid, date });
    this.logger.log(
      `fetchCharacterPopularity: ${ocid.slice(0, 10) + '...'} => ${JSON.stringify(res).slice(0, 50) + '...'}`,
    );
    return res.popularity;
  }

  async fetchCharacterStat(ocid: string, date?: string): Promise<StatDto> {
    const res = await this.nxapi<any>('/character/stat', { ocid, date });
    this.logger.log(`fetchCharacterStat: ${ocid.slice(0, 10) + '...'} => ${JSON.stringify(res).slice(0, 50) + '...'}`);
    return statMapper(res);
  }

  async fetchCharacterHyperStat(ocid: string, date?: string): Promise<HyperStatPresetDto[]> {
    const res = await this.nxapi<any>('/character/hyper-stat', { ocid, date });
    this.logger.log(
      `fetchCharacterHyperStat: ${ocid.slice(0, 10) + '...'} => ${JSON.stringify(res).slice(0, 50) + '...'}`,
    );
    return hyperStatMapper(res);
  }

  async fetchCharacterPropensity(ocid: string, date?: string): Promise<PropensityDto> {
    const res = await this.nxapi<any>('/character/propensity', { ocid, date });
    this.logger.log(
      `fetchCharacterPropensity: ${ocid.slice(0, 10) + '...'} => ${JSON.stringify(res).slice(0, 50) + '...'}`,
    );
    return propensityMapper(res);
  }

  async fetchCharacterAbility(ocid: string, date?: string): Promise<AbilityDto> {
    const res = await this.nxapi<NxapiAbilityData>('/character/ability', { ocid, date });
    this.logger.log(
      `fetchCharacterAbility: ${ocid.slice(0, 10) + '...'} => ${JSON.stringify(res).slice(0, 50) + '...'}`,
    );
    return abilityMapper(res);
  }

  async fetchCharacterItemEquipment(ocid: string, date?: string): Promise<ItemEquipmentPresetDto[]> {
    const res = await this.nxapi<NxapiItemEquipment>('/character/item-equipment', { ocid, date });
    this.logger.log(
      `fetchCharacterItemEquipment: ${ocid.slice(0, 10) + '...'} => ${JSON.stringify(res).slice(0, 50) + '...'}`,
    );
    return itemEquipmentMapper(res);
  }

  async fetchCharacterCashitemEquipment(ocid: string, date?: string): Promise<object> {
    const res = await this.nxapi<any>('/character/cashitem-equipment', {
      ocid,
      date,
    });
    this.logger.log(
      `fetchCharacterCashitemEquipment: ${ocid.slice(0, 10) + '...'} => ${JSON.stringify(res).slice(0, 50) + '...'}`,
    );
    return res;
  }

  async fetchCharacterSymbolEquipment(ocid: string, date?: string): Promise<object> {
    const res = await this.nxapi<any>('/character/symbol-equipment', { ocid, date });
    this.logger.log(
      `fetchCharacterSymbolEquipment: ${ocid.slice(0, 10) + '...'} => ${JSON.stringify(res).slice(0, 50) + '...'}`,
    );
    return res;
  }

  async fetchCharacterSetEffect(ocid: string, date?: string): Promise<object> {
    const res = await this.nxapi<any>('/character/set-effect', { ocid, date });
    this.logger.log(
      `fetchCharacterSetEffect: ${ocid.slice(0, 10) + '...'} => ${JSON.stringify(res).slice(0, 50) + '...'}`,
    );
    return res;
  }

  async fetchCharacterBeautyEquipment(ocid: string, date?: string): Promise<object> {
    const res = await this.nxapi<any>('/character/beauty-equipment', { ocid, date });
    this.logger.log(
      `fetchCharacterBeautyEquipment: ${ocid.slice(0, 10) + '...'} => ${JSON.stringify(res).slice(0, 50) + '...'}`,
    );
    return res;
  }

  async fetchCharacterAndroidEquipment(ocid: string, date?: string): Promise<object> {
    const res = await this.nxapi<any>('/character/android-equipment', {
      ocid,
      date,
    });
    this.logger.log(
      `fetchCharacterAndroidEquipment: ${ocid.slice(0, 10) + '...'} => ${JSON.stringify(res).slice(0, 50) + '...'}`,
    );
    return res;
  }

  async fetchCharacterPetEquipment(ocid: string, date?: string): Promise<object> {
    const res = await this.nxapi<any>('/character/pet-equipment', { ocid, date });
    this.logger.log(
      `fetchCharacterPetEquipment: ${ocid.slice(0, 10) + '...'} => ${JSON.stringify(res).slice(0, 50) + '...'}`,
    );
    return res;
  }

  async fetchCharacterSkill(ocid: string, skillGrade: SkillGrade, date?: string): Promise<object> {
    const res = await this.nxapi<any>('/character/skill', {
      ocid,
      date,
      character_skill_grade: skillGrade,
    });
    this.logger.log(`fetchCharacterSkill: ${ocid.slice(0, 10) + '...'} => ${JSON.stringify(res).slice(0, 50) + '...'}`);
    return res;
  }

  async fetchCharacterLinkSkill(ocid: string, date?: string): Promise<object> {
    const res = await this.nxapi<any>('/character/link-skill', { ocid, date });
    this.logger.log(
      `fetchCharacterLinkSkill: ${ocid.slice(0, 10) + '...'} => ${JSON.stringify(res).slice(0, 50) + '...'}`,
    );
    return res;
  }

  async fetchCharacterVmatrix(ocid: string, date?: string): Promise<object> {
    const res = await this.nxapi<any>('/character/vmatrix', { ocid, date });
    this.logger.log(
      `fetchCharacterVmatrix: ${ocid.slice(0, 10) + '...'} => ${JSON.stringify(res).slice(0, 50) + '...'}`,
    );
    return res;
  }

  async fetchCharacterHexamatrix(ocid: string, date?: string): Promise<object> {
    const res = await this.nxapi<any>('/character/hexamatrix', { ocid, date });
    this.logger.log(
      `fetchCharacterHexamatrix: ${ocid.slice(0, 10) + '...'} => ${JSON.stringify(res).slice(0, 50) + '...'}`,
    );
    return res;
  }

  async fetchCharacterHexamatrixStat(ocid: string, date?: string): Promise<object> {
    const res = await this.nxapi<any>('/character/hexamatrix-stat', { ocid, date });
    this.logger.log(
      `fetchCharacterHexamatrixStat: ${ocid.slice(0, 10) + '...'} => ${JSON.stringify(res).slice(0, 50) + '...'}`,
    );
    return res;
  }

  async fetchCharacterDojang(ocid: string, date?: string): Promise<object> {
    const res = await this.nxapi<any>('/character/dojang', { ocid, date });
    this.logger.log(
      `fetchCharacterDojang: ${ocid.slice(0, 10) + '...'} => ${JSON.stringify(res).slice(0, 50) + '...'}`,
    );
    return res;
  }
}
