import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import axiosRetry from 'axios-retry';
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

  private async nxapi(url: string, params: { [key: string]: string }) {
    try {
      const res = await this.httpService.axiosRef.get(url, { params });
      return res.data;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async fetchCharacterOcid(characterName: string): Promise<string> {
    const res = await this.nxapi('/id', { character_name: characterName });
    this.logger.log(`fetchCharacterOcid: ${characterName} => ${res.ocid}`);
    return res.ocid;
  }

  async fetchCharacterBasic(ocid: string, date?: string): Promise<object> {
    const res = await this.nxapi('/character/basic', { ocid, date });
    this.logger.log(`fetchCharacterBasic: ${ocid.slice(0, 10) + '...'} => ${JSON.stringify(res).slice(0, 30) + '...'}`);
    return res;
  }

  async fetchCharacterPopularity(ocid: string, date?: string): Promise<object> {
    const res = await this.nxapi('/character/popularity', { ocid, date });
    this.logger.log(
      `fetchCharacterPopularity: ${ocid.slice(0, 10) + '...'} => ${JSON.stringify(res).slice(0, 30) + '...'}`,
    );
    return res;
  }

  async fetchCharacterStat(ocid: string, date?: string): Promise<object> {
    const res = await this.nxapi('/character/stat', { ocid, date });
    this.logger.log(`fetchCharacterStat: ${ocid.slice(0, 10) + '...'} => ${JSON.stringify(res).slice(0, 30) + '...'}`);
    return res;
  }

  async fetchCharacterHyperStat(ocid: string, date?: string): Promise<object> {
    const res = await this.nxapi('/character/hyper-stat', { ocid, date });
    this.logger.log(
      `fetchCharacterHyperStat: ${ocid.slice(0, 10) + '...'} => ${JSON.stringify(res).slice(0, 30) + '...'}`,
    );
    return res;
  }

  async fetchCharacterPropensity(ocid: string, date?: string): Promise<object> {
    const res = await this.nxapi('/character/propensity', { ocid, date });
    this.logger.log(
      `fetchCharacterPropensity: ${ocid.slice(0, 10) + '...'} => ${JSON.stringify(res).slice(0, 30) + '...'}`,
    );
    return res;
  }

  async fetchCharacterAbility(ocid: string, date?: string): Promise<NxapiAbilityData> {
    const res = await this.nxapi('/character/ability', { ocid, date });
    this.logger.log(
      `fetchCharacterAbility: ${ocid.slice(0, 10) + '...'} => ${JSON.stringify(res).slice(0, 30) + '...'}`,
    );
    return res;
  }

  async fetchCharacterItemEquipment(ocid: string, date?: string): Promise<NxapiItemEquipment> {
    const res = await this.nxapi('/character/item-equipment', { ocid, date });
    this.logger.log(
      `fetchCharacterItemEquipment: ${ocid.slice(0, 10) + '...'} => ${JSON.stringify(res).slice(0, 30) + '...'}`,
    );
    return res;
  }

  async fetchCharacterCashitemEquipment(ocid: string, date?: string): Promise<object> {
    const res = await this.nxapi('/character/cashitem-equipment', {
      ocid,
      date,
    });
    this.logger.log(
      `fetchCharacterCashitemEquipment: ${ocid.slice(0, 10) + '...'} => ${JSON.stringify(res).slice(0, 30) + '...'}`,
    );
    return res;
  }

  async fetchCharacterSymbolEquipment(ocid: string, date?: string): Promise<object> {
    const res = await this.nxapi('/character/symbol-equipment', { ocid, date });
    this.logger.log(
      `fetchCharacterSymbolEquipment: ${ocid.slice(0, 10) + '...'} => ${JSON.stringify(res).slice(0, 30) + '...'}`,
    );
    return res;
  }

  async fetchCharacterSetEffect(ocid: string, date?: string): Promise<object> {
    const res = await this.nxapi('/character/set-effect', { ocid, date });
    this.logger.log(
      `fetchCharacterSetEffect: ${ocid.slice(0, 10) + '...'} => ${JSON.stringify(res).slice(0, 30) + '...'}`,
    );
    return res;
  }

  async fetchCharacterBeautyEquipment(ocid: string, date?: string): Promise<object> {
    const res = await this.nxapi('/character/beauty-equipment', { ocid, date });
    this.logger.log(
      `fetchCharacterBeautyEquipment: ${ocid.slice(0, 10) + '...'} => ${JSON.stringify(res).slice(0, 30) + '...'}`,
    );
    return res;
  }

  async fetchCharacterAndroidEquipment(ocid: string, date?: string): Promise<object> {
    const res = await this.nxapi('/character/android-equipment', {
      ocid,
      date,
    });
    this.logger.log(
      `fetchCharacterAndroidEquipment: ${ocid.slice(0, 10) + '...'} => ${JSON.stringify(res).slice(0, 30) + '...'}`,
    );
    return res;
  }

  async fetchCharacterPetEquipment(ocid: string, date?: string): Promise<object> {
    const res = await this.nxapi('/character/pet-equipment', { ocid, date });
    this.logger.log(
      `fetchCharacterPetEquipment: ${ocid.slice(0, 10) + '...'} => ${JSON.stringify(res).slice(0, 30) + '...'}`,
    );
    return res;
  }

  async fetchCharacterSkill(ocid: string, skillGrade: SkillGrade, date?: string): Promise<object> {
    const res = await this.nxapi('/character/skill', {
      ocid,
      date,
      character_skill_grade: skillGrade,
    });
    this.logger.log(`fetchCharacterSkill: ${ocid.slice(0, 10) + '...'} => ${JSON.stringify(res).slice(0, 30) + '...'}`);
    return res;
  }

  async fetchCharacterLinkSkill(ocid: string, date?: string): Promise<object> {
    const res = await this.nxapi('/character/link-skill', { ocid, date });
    this.logger.log(
      `fetchCharacterLinkSkill: ${ocid.slice(0, 10) + '...'} => ${JSON.stringify(res).slice(0, 30) + '...'}`,
    );
    return res;
  }

  async fetchCharacterVmatrix(ocid: string, date?: string): Promise<object> {
    const res = await this.nxapi('/character/vmatrix', { ocid, date });
    this.logger.log(
      `fetchCharacterVmatrix: ${ocid.slice(0, 10) + '...'} => ${JSON.stringify(res).slice(0, 30) + '...'}`,
    );
    return res;
  }

  async fetchCharacterHexamatrix(ocid: string, date?: string): Promise<object> {
    const res = await this.nxapi('/character/hexamatrix', { ocid, date });
    this.logger.log(
      `fetchCharacterHexamatrix: ${ocid.slice(0, 10) + '...'} => ${JSON.stringify(res).slice(0, 30) + '...'}`,
    );
    return res;
  }

  async fetchCharacterHexamatrixStat(ocid: string, date?: string): Promise<object> {
    const res = await this.nxapi('/character/hexamatrix-stat', { ocid, date });
    this.logger.log(
      `fetchCharacterHexamatrixStat: ${ocid.slice(0, 10) + '...'} => ${JSON.stringify(res).slice(0, 30) + '...'}`,
    );
    return res;
  }

  async fetchCharacterDojang(ocid: string, date?: string): Promise<object> {
    const res = await this.nxapi('/character/dojang', { ocid, date });
    this.logger.log(
      `fetchCharacterDojang: ${ocid.slice(0, 10) + '...'} => ${JSON.stringify(res).slice(0, 30) + '...'}`,
    );
    return res;
  }
}
