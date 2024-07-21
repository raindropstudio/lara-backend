import { Module } from '@nestjs/common';
import { CharacterModule } from 'src/character/character.module';
import { ApiController } from './api.controller';

@Module({
  imports: [CharacterModule],
  controllers: [ApiController],
})
export class ApiModule {}
