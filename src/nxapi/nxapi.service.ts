import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import axiosRetry from 'axios-retry';
import { AbilityDto } from 'src/common/dto/ability.dto';
import { CashEquipmentPresetDto } from 'src/common/dto/cash-equipment.dto';
import { CharacterBasicDto } from 'src/common/dto/character-basic.dto';
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
import { abilityMapper } from './mapper/ability.mapper';
import { cashEquipmentMapper } from './mapper/cashitem-equipment.mapper';
import { characterBasicMapper } from './mapper/character-basic.mapper';
import { hexaMatrixMapper } from './mapper/hexa-matrix.mapper';
import { hexaStatMapper } from './mapper/hexa-stat.mapper';
import { hyperStatMapper } from './mapper/hyper-stat.mapper';
import { itemEquipmentMapper } from './mapper/item-equipment.mapper';
import { linkSkillMapper } from './mapper/link-skill.mapper';
import { petEquipmentMapper } from './mapper/pet-equipment.mapper';
import { propensityMapper } from './mapper/propensity.mapper';
import { setEffectMapper } from './mapper/set-effect.mapper';
import { skillMapper } from './mapper/skill.mapper';
import { statMapper } from './mapper/stat.mapper';
import { symbolMapper } from './mapper/symbol.mapper';
import { unionMapper } from './mapper/union.mapper';
import { vMatrixMapper } from './mapper/vmatrix.mapper';
import { NxapiAbilityData } from './type/nxapi-ability.type';
import { NxApiCashEquipment } from './type/nxapi-cash-equipment.type';
import { NxapiHexaMatrixStatData } from './type/nxapi-hexamatrix-stat.type';
import { NxapiHexaMatrixData } from './type/nxapi-hexamatrix.type';
import { NxapiItemEquipment } from './type/nxapi-item-equipment.type';
import { NxapiLinkSkillData } from './type/nxapi-link-skill.type';
import { NxapiPetEquipmentData } from './type/nxapi-pet-equipment.type';
import { NxapiSetEffect } from './type/nxapi-set-effect.type';
import { NxapiSkillData } from './type/nxapi-skill.type';
import { NxapiSymbolData } from './type/nxapi-symbol.type';
import { NxapiUnionRankingData } from './type/nxapi-union-ranking.type';
import { NxapiUnion } from './type/nxapi-union.type';
import { NxapiVMatrixData } from './type/nxapi-vmatrix.type';

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

  async fetchCharacterSymbolEquipment(ocid: string, date?: string): Promise<SymbolDto[]> {
    const res = await this.nxapi<NxapiSymbolData>('/character/symbol-equipment', { ocid, date });
    return symbolMapper(res);
  }

  async fetchCharacterSetEffect(ocid: string, date?: string): Promise<SetEffectDto[]> {
    const res = await this.nxapi<NxapiSetEffect>('/character/set-effect', { ocid, date });
    return setEffectMapper(res);
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

  async fetchCharacterPetEquipment(ocid: string, date?: string): Promise<PetEquipmentDataDto[]> {
    const res = await this.nxapi<NxapiPetEquipmentData>('/character/pet-equipment', { ocid, date });
    return petEquipmentMapper(res);
  }

  async fetchCharacterSkill(ocid: string, skillGrade: SkillGrade, date?: string): Promise<CharacterSkillDto[]> {
    const res = await this.nxapi<NxapiSkillData>('/character/skill', {
      ocid,
      date,
      character_skill_grade: skillGrade,
    });
    return skillMapper(skillGrade, res);
  }

  async fetchCharacterLinkSkill(ocid: string, date?: string): Promise<CharacterLinkSkillDto[]> {
    const res = await this.nxapi<NxapiLinkSkillData>('/character/link-skill', { ocid, date });
    return linkSkillMapper(res);
  }

  async fetchCharacterVmatrix(ocid: string, date?: string): Promise<CharacterSkillCoreDto[]> {
    const res = await this.nxapi<NxapiVMatrixData>('/character/vmatrix', { ocid, date });
    return vMatrixMapper(res);
  }

  async fetchCharacterHexamatrix(ocid: string, date?: string): Promise<CharacterSkillCoreDto[]> {
    const res = await this.nxapi<NxapiHexaMatrixData>('/character/hexamatrix', { ocid, date });
    return hexaMatrixMapper(res);
  }

  async fetchCharacterHexamatrixStat(ocid: string, date?: string): Promise<HexaStatDto[]> {
    const res = await this.nxapi<NxapiHexaMatrixStatData>('/character/hexamatrix-stat', { ocid, date });
    return hexaStatMapper(res);
  }

  // 유니온

  async fetchUnion(ocid: string, date?: string): Promise<UnionDto | null> {
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
