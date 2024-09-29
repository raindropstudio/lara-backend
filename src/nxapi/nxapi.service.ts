import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import axiosRetry from 'axios-retry';
import { AbilityDto } from 'src/common/dto/ability.dto';
import { CashEquipmentPresetDto } from 'src/common/dto/cash-equipment.dto';
import { CharacterBasicDto } from 'src/common/dto/character-basic.dto';
import { HyperStatPresetDto } from 'src/common/dto/hyper-stat.dto';
import { ItemEquipmentPresetDto } from 'src/common/dto/item-equipment.dto';
import { PropensityDto } from 'src/common/dto/propensity.dto';
import { StatDto } from 'src/common/dto/stat.dto';
import { UnionDto } from 'src/common/dto/union.dto';
import { abilityMapper } from './mapper/ability.mapper';
import { cashEquipmentMapper } from './mapper/cashitem-equipment.mapper';
import { characterBasicMapper } from './mapper/character-basic.mapper';
import { hyperStatMapper } from './mapper/hyper-stat.mapper';
import { itemEquipmentMapper } from './mapper/item-equipment.mapper';
import { propensityMapper } from './mapper/propensity.mapper';
import { statMapper } from './mapper/stat.mapper';
import { unionMapper } from './mapper/union.mapper';
import { NxapiAbilityData } from './type/nxapi-ability.type';
import { NxApiCashEquipment } from './type/nxapi-cash-equipment.type';
import { NxapiItemEquipment } from './type/nxapi-item-equipment.type';
import { NxapiUnionRankingData } from './type/nxapi-union-ranking.type';
import { NxapiUnion } from './type/nxapi-union.type';

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
      this.logger.verbose(
        `${url} ` +
          `${'..' + JSON.stringify(params).slice(9, 16) + '..'} => ` +
          `${'..' + JSON.stringify(res.data).slice(10, 60) + '...'}`,
      );
      return res.data;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  // 캐릭터

  async fetchCharacterOcid(characterName: string): Promise<string> {
    const res = await this.nxapi<any>('/id', { character_name: characterName });
    return res.ocid;
  }

  async fetchCharacterBasic(ocid: string, date?: string): Promise<CharacterBasicDto> {
    const res = await this.nxapi<any>('/character/basic', { ocid, date });
    return characterBasicMapper(ocid, res);
  }

  async fetchCharacterPopularity(ocid: string, date?: string): Promise<number> {
    const res = await this.nxapi<any>('/character/popularity', { ocid, date });
    return res.popularity;
  }

  async fetchCharacterStat(ocid: string, date?: string): Promise<StatDto> {
    const res = await this.nxapi<any>('/character/stat', { ocid, date });
    return statMapper(res);
  }

  async fetchCharacterHyperStat(ocid: string, date?: string): Promise<HyperStatPresetDto[]> {
    const res = await this.nxapi<any>('/character/hyper-stat', { ocid, date });
    return hyperStatMapper(res);
  }

  async fetchCharacterPropensity(ocid: string, date?: string): Promise<PropensityDto> {
    const res = await this.nxapi<any>('/character/propensity', { ocid, date });
    return propensityMapper(res);
  }

  async fetchCharacterAbility(ocid: string, date?: string): Promise<AbilityDto> {
    const res = await this.nxapi<NxapiAbilityData>('/character/ability', { ocid, date });
    return abilityMapper(res);
  }

  async fetchCharacterItemEquipment(ocid: string, date?: string): Promise<ItemEquipmentPresetDto[]> {
    const res = await this.nxapi<NxapiItemEquipment>('/character/item-equipment', { ocid, date });
    return itemEquipmentMapper(res);
  }

  async fetchCharacterCashitemEquipment(ocid: string, date?: string): Promise<CashEquipmentPresetDto[]> {
    const res = await this.nxapi<NxApiCashEquipment>('/character/cashitem-equipment', { ocid, date });
    return cashEquipmentMapper(res);
  }

  async fetchCharacterSymbolEquipment(ocid: string, date?: string): Promise<object> {
    const res = await this.nxapi<any>('/character/symbol-equipment', { ocid, date });
    return res;
  }

  async fetchCharacterSetEffect(ocid: string, date?: string): Promise<object> {
    const res = await this.nxapi<any>('/character/set-effect', { ocid, date });
    return res;
  }

  async fetchCharacterBeautyEquipment(ocid: string, date?: string): Promise<object> {
    const res = await this.nxapi<any>('/character/beauty-equipment', { ocid, date });
    return res;
  }

  async fetchCharacterAndroidEquipment(ocid: string, date?: string): Promise<object> {
    const res = await this.nxapi<any>('/character/android-equipment', {
      ocid,
      date,
    });
    return res;
  }

  async fetchCharacterPetEquipment(ocid: string, date?: string): Promise<object> {
    const res = await this.nxapi<any>('/character/pet-equipment', { ocid, date });
    return res;
  }

  async fetchCharacterSkill(ocid: string, skillGrade: SkillGrade, date?: string): Promise<object> {
    const res = await this.nxapi<any>('/character/skill', {
      ocid,
      date,
      character_skill_grade: skillGrade,
    });
    return res;
  }

  async fetchCharacterLinkSkill(ocid: string, date?: string): Promise<object> {
    const res = await this.nxapi<any>('/character/link-skill', { ocid, date });
    return res;
  }

  async fetchCharacterVmatrix(ocid: string, date?: string): Promise<object> {
    const res = await this.nxapi<any>('/character/vmatrix', { ocid, date });
    return res;
  }

  async fetchCharacterHexamatrix(ocid: string, date?: string): Promise<object> {
    const res = await this.nxapi<any>('/character/hexamatrix', { ocid, date });
    return res;
  }

  async fetchCharacterHexamatrixStat(ocid: string, date?: string): Promise<object> {
    const res = await this.nxapi<any>('/character/hexamatrix-stat', { ocid, date });
    return res;
  }

  // 유니온

  async fetchUnion(ocid: string, date?: string): Promise<UnionDto> {
    const res = await this.nxapi<NxapiUnion>('/user/union', { ocid, date });
    return unionMapper(res);
  }

  // 랭킹

  async fetchUnionRanking(date?: string, worldName?: string, ocid?: string, page?: string): Promise<object> {
    // 조회시각이 KST 오전 8시 30분 이전일 경우 전날, 이외에는 오늘로 date 자동설정
    //? 안전빵 더 줘서 8시 59분
    if (!date) {
      const now = new Date();
      const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
      const kstHour = kst.getHours();
      date =
        kstHour < 8 || (kstHour === 8 && kst.getMinutes() < 59)
          ? new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
          : now.toISOString().slice(0, 10);
    }
    const res = await this.nxapi<NxapiUnionRankingData>('/ranking/union', { date, world_name: worldName, ocid, page });
    return res;
  }
}
