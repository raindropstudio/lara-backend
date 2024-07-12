import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { NxapiService } from './nxapi/nxapi.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly nxapiService: NxapiService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/test')
  async test(): Promise<string> {
    const ocid = await this.nxapiService.getCharacterOcid('소주에보드카');

    //TODO: 테스트 API 삭제 & 동시성 컨트롤
    const promises = [
      this.nxapiService.getCharacterBasic(ocid),
      this.nxapiService.getCharacterPopularity(ocid),
      this.nxapiService.getCharacterStat(ocid),
      this.nxapiService.getCharacterHyperStat(ocid),
      this.nxapiService.getCharacterPropensity(ocid),
      this.nxapiService.getCharacterAbility(ocid),
      this.nxapiService.getCharacterItemEquipment(ocid),
      this.nxapiService.getCharacterCashitemEquipment(ocid),
      this.nxapiService.getCharacterSymbolEquipment(ocid),
      this.nxapiService.getCharacterSetEffect(ocid),
      this.nxapiService.getCharacterBeautyEquipment(ocid),
      this.nxapiService.getCharacterAndroidEquipment(ocid),
      this.nxapiService.getCharacterPetEquipment(ocid),
      this.nxapiService.getCharacterSkill(ocid, '5'),
    ];

    const results = await Promise.all(promises);
    const res = results.reduce((acc, curr) => acc + JSON.stringify(curr), '');

    return res;
  }
}
