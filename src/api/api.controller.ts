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
    const { update } = query;
    //TODO: 오류 예외처리
    this.logger.log(`getCharacterOverall: ${nickname}, ${update}`);
    const res = await this.characterService.getCharacterOverall(nickname, update);
    return new CharacterDTO(res);
  }
}
