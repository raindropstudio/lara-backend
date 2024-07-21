import { Module } from '@nestjs/common';
import { NxapiModule } from 'src/nxapi/nxapi.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { CharacterService } from './character.service';
import { CharacterRepository } from './repository/character.repository';

@Module({
  imports: [NxapiModule],
  providers: [CharacterService, PrismaService, CharacterRepository],
  exports: [CharacterService],
})
export class CharacterModule {}
