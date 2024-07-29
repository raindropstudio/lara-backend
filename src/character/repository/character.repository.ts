import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Character } from '../type/character.type';

@Injectable()
export class CharacterRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findCharacterOverallByNickname(nickname: string) {
    return this.prismaService.character.findUnique({
      where: {
        nickname,
      },
      include: {
        stat: true,
        hyperStat: true,
        propensity: true,
        ability: true,
      },
    });
  }

  async upsertCharacterOverall(characterData: Character) {
    console.log(`Upserting character: ${characterData.nickname}`);
    return this.prismaService.character.upsert({
      where: {
        nickname: characterData.nickname,
      },
      update: {
        ...characterData,
        stat: {
          deleteMany: {},
          create: characterData.stat,
        },
        hyperStat: {
          deleteMany: {},
          create: characterData.hyperStat,
        },
        propensity: {
          update: characterData.propensity,
        },
        ability: {
          deleteMany: {},
          create: characterData.ability,
        },
      },
      create: {
        ...characterData,
        stat: {
          create: characterData.stat,
        },
        hyperStat: {
          create: characterData.hyperStat,
        },
        propensity: {
          create: characterData.propensity,
        },
        ability: {
          create: characterData.ability,
        },
      },
    });
  }
}
