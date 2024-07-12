import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import axiosRetry from 'axios-retry';

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

  async getCharacterOcid(characterName: string): Promise<string> {
    const res = await this.nxapi('/id', { character_name: characterName });
    this.logger.log(`getCharacterOcid: ${characterName} => ${res.ocid}`);
    return res.ocid;
  }

  async getCharacterBasic(ocid: string, date?: string): Promise<object> {
    const res = await this.nxapi('/character/basic', { ocid, date });
    this.logger.log(`getCharacterBasic: ${ocid.slice(0, 10) + '...'} => ${JSON.stringify(res).slice(0, 30) + '...'}`);
    return res;
  }

  async getCharacterPopularity(ocid: string, date?: string): Promise<object> {
    const res = await this.nxapi('/character/popularity', { ocid, date });
    this.logger.log(
      `getCharacterPopularity: ${ocid.slice(0, 10) + '...'} => ${JSON.stringify(res).slice(0, 30) + '...'}`,
    );
    return res;
  }

  async getCharacterStat(ocid: string, date?: string): Promise<object> {
    const res = await this.nxapi('/character/stat', { ocid, date });
    this.logger.log(`getCharacterStat: ${ocid.slice(0, 10) + '...'} => ${JSON.stringify(res).slice(0, 30) + '...'}`);
    return res;
  }

  async getCharacterHyperStat(ocid: string, date?: string): Promise<object> {
    const res = await this.nxapi('/character/hyper-stat', { ocid, date });
    this.logger.log(
      `getCharacterHyperStat: ${ocid.slice(0, 10) + '...'} => ${JSON.stringify(res).slice(0, 30) + '...'}`,
    );
    return res;
  }

  async getCharacterPropensity(ocid: string, date?: string): Promise<object> {
    const res = await this.nxapi('/character/propensity', { ocid, date });
    this.logger.log(
      `getCharacterPropensity: ${ocid.slice(0, 10) + '...'} => ${JSON.stringify(res).slice(0, 30) + '...'}`,
    );
    return res;
  }

  async getCharacterAbility(ocid: string, date?: string): Promise<object> {
    const res = await this.nxapi('/character/ability', { ocid, date });
    this.logger.log(`getCharacterAbility: ${ocid.slice(0, 10) + '...'} => ${JSON.stringify(res).slice(0, 30) + '...'}`);
    return res;
  }

  async getCharacterItemEquipment(ocid: string, date?: string): Promise<object> {
    const res = await this.nxapi('/character/item-equipment', { ocid, date });
    this.logger.log(
      `getCharacterItemEquipment: ${ocid.slice(0, 10) + '...'} => ${JSON.stringify(res).slice(0, 30) + '...'}`,
    );
    return res;
  }

  async getCharacterCashitemEquipment(ocid: string, date?: string): Promise<object> {
    const res = await this.nxapi('/character/cashitem-equipment', {
      ocid,
      date,
    });
    this.logger.log(
      `getCharacterCashitemEquipment: ${ocid.slice(0, 10) + '...'} => ${JSON.stringify(res).slice(0, 30) + '...'}`,
    );
    return res;
  }

  async getCharacterSymbolEquipment(ocid: string, date?: string): Promise<object> {
    const res = await this.nxapi('/character/symbol-equipment', { ocid, date });
    this.logger.log(
      `getCharacterSymbolEquipment: ${ocid.slice(0, 10) + '...'} => ${JSON.stringify(res).slice(0, 30) + '...'}`,
    );
    return res;
  }

  async getCharacterSetEffect(ocid: string, date?: string): Promise<object> {
    const res = await this.nxapi('/character/set-effect', { ocid, date });
    this.logger.log(
      `getCharacterSetEffect: ${ocid.slice(0, 10) + '...'} => ${JSON.stringify(res).slice(0, 30) + '...'}`,
    );
    return res;
  }

  async getCharacterBeautyEquipment(ocid: string, date?: string): Promise<object> {
    const res = await this.nxapi('/character/beauty-equipment', { ocid, date });
    this.logger.log(
      `getCharacterBeautyEquipment: ${ocid.slice(0, 10) + '...'} => ${JSON.stringify(res).slice(0, 30) + '...'}`,
    );
    return res;
  }

  async getCharacterAndroidEquipment(ocid: string, date?: string): Promise<object> {
    const res = await this.nxapi('/character/android-equipment', {
      ocid,
      date,
    });
    this.logger.log(
      `getCharacterAndroidEquipment: ${ocid.slice(0, 10) + '...'} => ${JSON.stringify(res).slice(0, 30) + '...'}`,
    );
    return res;
  }

  async getCharacterPetEquipment(ocid: string, date?: string): Promise<object> {
    const res = await this.nxapi('/character/pet-equipment', { ocid, date });
    this.logger.log(
      `getCharacterPetEquipment: ${ocid.slice(0, 10) + '...'} => ${JSON.stringify(res).slice(0, 30) + '...'}`,
    );
    return res;
  }

  async getCharacterSkill(ocid: string, skillGrade: SkillGrade, date?: string): Promise<object> {
    const res = await this.nxapi('/character/skill', {
      ocid,
      date,
      character_skill_grade: skillGrade,
    });
    this.logger.log(`getCharacterSkill: ${ocid.slice(0, 10) + '...'} => ${JSON.stringify(res).slice(0, 30) + '...'}`);
    return res;
  }

  async getCharacterLinkSkill(ocid: string, date?: string): Promise<object> {
    const res = await this.nxapi('/character/link-skill', { ocid, date });
    this.logger.log(
      `getCharacterLinkSkill: ${ocid.slice(0, 10) + '...'} => ${JSON.stringify(res).slice(0, 30) + '...'}`,
    );
    return res;
  }

  async getCharacterVmatrix(ocid: string, date?: string): Promise<object> {
    const res = await this.nxapi('/character/vmatrix', { ocid, date });
    this.logger.log(`getCharacterVmatrix: ${ocid.slice(0, 10) + '...'} => ${JSON.stringify(res).slice(0, 30) + '...'}`);
    return res;
  }

  async getCharacterHexamatrix(ocid: string, date?: string): Promise<object> {
    const res = await this.nxapi('/character/hexamatrix', { ocid, date });
    this.logger.log(
      `getCharacterHexamatrix: ${ocid.slice(0, 10) + '...'} => ${JSON.stringify(res).slice(0, 30) + '...'}`,
    );
    return res;
  }

  async getCharacterHexamatrixStat(ocid: string, date?: string): Promise<object> {
    const res = await this.nxapi('/character/hexamatrix-stat', { ocid, date });
    this.logger.log(
      `getCharacterHexamatrixStat: ${ocid.slice(0, 10) + '...'} => ${JSON.stringify(res).slice(0, 30) + '...'}`,
    );
    return res;
  }

  async getCharacterDojang(ocid: string, date?: string): Promise<object> {
    const res = await this.nxapi('/character/dojang', { ocid, date });
    this.logger.log(`getCharacterDojang: ${ocid.slice(0, 10) + '...'} => ${JSON.stringify(res).slice(0, 30) + '...'}`);
    return res;
  }
}
