import { Controller, Get, Logger, Param, Query } from '@nestjs/common';
import { CharacterService } from 'src/character/character.service';
import { CharacterDTO } from './dto/character.dto';
import { GetCharacterOverallDto } from './dto/get-character-overall.dto';

@Controller()
export class ApiController {
  constructor(private readonly characterService: CharacterService) {}
  private readonly logger = new Logger(ApiController.name);

  @Get('character/:nickname')
  async getCharacterOverall(
    @Param('nickname') nickname: string,
    @Query() query: GetCharacterOverallDto,
  ): Promise<CharacterDTO> {
    const { date, update } = query;
    //TODO: date는 전일 데이터까지 조회가능 (전일 데이터는 금일 오전 2시부터 조회가능) -> 입력 검사및 예외처리하기
    //TODO: 오류 예외처리
    this.logger.log(`getCharacterOverall: ${nickname}, ${date}, ${update}`);
    const res = await this.characterService.getCharacterOverall(nickname, date, update);
    return new CharacterDTO(res);
  }
}
