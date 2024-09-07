import { Controller, Get, Logger, Param, Query } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CharacterService } from 'src/character/character.service';
import { CharacterOverallResDto } from './dto/character-overall-res.dto';

@Controller()
export class ApiController {
  constructor(private readonly characterService: CharacterService) {}
  private readonly logger = new Logger(ApiController.name);

  @Get('character/:nickname')
  async getCharacterOverall(
    @Param('nickname') nickname: string,
    @Query('update') update?: boolean,
  ): Promise<CharacterOverallResDto> {
    //TODO: 오류 예외처리
    this.logger.log(`getCharacterOverall: ${nickname}, ${update}`);
    const res = await this.characterService.getCharacterOverall(nickname, update);
    return plainToInstance(CharacterOverallResDto, res);
  }
}
