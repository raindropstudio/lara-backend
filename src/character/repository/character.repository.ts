import { Injectable } from '@nestjs/common';
import { Character } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CharacterRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findCharacterOverallByNickname(nickname: string) {
    return this.prismaService.character.findUnique({
      where: {
        nickname,
      },
    });
  }

  async upsertCharacterOverall(characterData: Character) {
    return this.prismaService.character.upsert({
      where: {
        nickname: characterData.nickname,
      },
      update: characterData,
      create: characterData,
    });
  }
}
