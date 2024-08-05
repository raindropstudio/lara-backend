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
        itemEquipment: {
          include: {
            totalOption: true,
            baseOption: true,
            exceptionalOption: true,
            addOption: true,
            etcOption: true,
            starforceOption: true,
          },
        },
      },
    });
  }

  async upsertCharacterOverall(characterData: Character) {
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
          upsert: {
            update: characterData.propensity,
            create: characterData.propensity,
          },
        },
        ability: {
          deleteMany: {},
          create: characterData.ability,
        },
        itemEquipment: {
          deleteMany: {},
          create: characterData.itemEquipment.map((item) => ({
            ...item,
            totalOption: {
              connectOrCreate: {
                where: { id: item.totalOption.id }, // id 필드를 number 타입으로 지정
                create: item.totalOption,
              },
            },
            baseOption: {
              connectOrCreate: {
                where: { id: item.baseOption.id }, // id 필드를 number 타입으로 지정
                create: item.baseOption,
              },
            },
            exceptionalOption: {
              connectOrCreate: {
                where: { id: item.exceptionalOption.id }, // id 필드를 number 타입으로 지정
                create: item.exceptionalOption,
              },
            },
            addOption: {
              connectOrCreate: {
                where: { id: item.addOption.id }, // id 필드를 number 타입으로 지정
                create: item.addOption,
              },
            },
            etcOption: {
              connectOrCreate: {
                where: { id: item.etcOption.id }, // id 필드를 number 타입으로 지정
                create: item.etcOption,
              },
            },
            starforceOption: {
              connectOrCreate: {
                where: { id: item.starforceOption.id }, // id 필드를 number 타입으로 지정
                create: item.starforceOption,
              },
            },
          })),
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
        itemEquipment: {
          create: characterData.itemEquipment.map((item) => ({
            ...item,
            totalOption: {
              connectOrCreate: {
                where: { id: item.totalOption.id }, // id 필드를 number 타입으로 지정
                create: item.totalOption,
              },
            },
            baseOption: {
              connectOrCreate: {
                where: { id: item.baseOption.id }, // id 필드를 number 타입으로 지정
                create: item.baseOption,
              },
            },
            exceptionalOption: {
              connectOrCreate: {
                where: { id: item.exceptionalOption.id }, // id 필드를 number 타입으로 지정
                create: item.exceptionalOption,
              },
            },
            addOption: {
              connectOrCreate: {
                where: { id: item.addOption.id }, // id 필드를 number 타입으로 지정
                create: item.addOption,
              },
            },
            etcOption: {
              connectOrCreate: {
                where: { id: item.etcOption.id }, // id 필드를 number 타입으로 지정
                create: item.etcOption,
              },
            },
            starforceOption: {
              connectOrCreate: {
                where: { id: item.starforceOption.id }, // id 필드를 number 타입으로 지정
                create: item.starforceOption,
              },
            },
          })),
        },
      },
    });
  }
}
