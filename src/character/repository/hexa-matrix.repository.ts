import { Injectable } from '@nestjs/common';
import { HexaMatrixWithHash } from 'src/nxapi/mapper/hexa-matrix.mapper';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class HexaMatrixRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createOrIgnoreHexaMatrix(hexaMatrix: HexaMatrixWithHash) {
    try {
      await this.prismaService.$transaction(async (prisma) => {
        // 1. HexaCore 마스터 데이터 생성
        for (const core of hexaMatrix.cores) {
          const existingCore = await prisma.hexaCore.findUnique({
            where: {
              characterClass_coreName: {
                characterClass: hexaMatrix.characterClass,
                coreName: core.coreName,
              },
            },
            select: { descriptionHash: true },
          });

          // 해시가 같으면 업데이트 불필요
          if (existingCore?.descriptionHash === core.descriptionHash) continue;

          await prisma.hexaCore.upsert({
            where: {
              characterClass_coreName: {
                characterClass: hexaMatrix.characterClass,
                coreName: core.coreName,
              },
            },
            create: {
              characterClass: hexaMatrix.characterClass,
              coreName: core.coreName,
              coreType: core.coreType,
              description: core.skills[0]?.description ?? null,
              descriptionHash: core.descriptionHash,
            },
            update: {
              description: core.skills[0]?.description ?? null,
              descriptionHash: core.descriptionHash,
            },
          });
        }

        // 생성된 HexaCore의 ID 조회
        const hexaCores = await prisma.hexaCore.findMany({
          where: {
            OR: hexaMatrix.cores.map((core) => ({
              characterClass: hexaMatrix.characterClass,
              coreName: core.coreName,
            })),
          },
          select: {
            id: true,
            characterClass: true,
            coreName: true,
          },
        });

        const hexaCoreMap = new Map(hexaCores.map((core) => [`${core.characterClass}_${core.coreName}`, core.id]));

        // 2. HexaCoreSkill 마스터 데이터 생성
        for (const core of hexaMatrix.cores) {
          const hexaCoreId = hexaCoreMap.get(`${hexaMatrix.characterClass}_${core.coreName}`);

          for (const skill of core.skills) {
            const existingSkill = await prisma.hexaCoreSkill.findUnique({
              where: {
                hexaCoreId_skillName: {
                  hexaCoreId,
                  skillName: skill.skillName,
                },
              },
              select: { skillIcon: true },
            });

            // skillIcon 자체가 이미 고유한 값이므로 해당 값으로 비교
            if (existingSkill?.skillIcon === skill.skillIcon) continue;

            await prisma.hexaCoreSkill.upsert({
              where: {
                hexaCoreId_skillName: {
                  hexaCoreId,
                  skillName: skill.skillName,
                },
              },
              create: {
                hexaCoreId,
                skillName: skill.skillName,
                skillIcon: skill.skillIcon,
              },
              update: {
                skillIcon: skill.skillIcon,
              },
            });
          }
        }

        // 생성된 HexaCoreSkill의 ID 조회
        const hexaCoreSkills = await prisma.hexaCoreSkill.findMany({
          where: {
            hexaCoreId: { in: Array.from(hexaCoreMap.values()) },
          },
          select: {
            id: true,
            hexaCoreId: true,
            skillName: true,
          },
        });

        const skillMap = new Map(hexaCoreSkills.map((skill) => [`${skill.hexaCoreId}_${skill.skillName}`, skill.id]));

        // 3. HexaCoreSkillEffect 마스터 데이터 생성
        for (const core of hexaMatrix.cores) {
          const hexaCoreId = hexaCoreMap.get(`${hexaMatrix.characterClass}_${core.coreName}`);

          for (const skill of core.skills) {
            const hexaCoreSkillId = skillMap.get(`${hexaCoreId}_${skill.skillName}`);

            // 현재 레벨 효과
            const existingEffect = await prisma.hexaCoreSkillEffect.findUnique({
              where: {
                hexaCoreSkillId_level: {
                  hexaCoreSkillId,
                  level: core.coreLevel,
                },
              },
              select: { hash: true },
            });

            if (existingEffect?.hash !== skill.effectHash) {
              await prisma.hexaCoreSkillEffect.upsert({
                where: {
                  hexaCoreSkillId_level: {
                    hexaCoreSkillId,
                    level: core.coreLevel,
                  },
                },
                create: {
                  hexaCoreSkillId,
                  level: core.coreLevel,
                  effect: skill.currentEffect,
                  hash: skill.effectHash,
                },
                update: {
                  effect: skill.currentEffect,
                  hash: skill.effectHash,
                },
              });
            }

            // 다음 레벨 효과
            if (skill.nextEffect) {
              const existingNextEffect = await prisma.hexaCoreSkillEffect.findUnique({
                where: {
                  hexaCoreSkillId_level: {
                    hexaCoreSkillId,
                    level: core.coreLevel + 1,
                  },
                },
                select: { hash: true },
              });

              if (existingNextEffect?.hash !== skill.nextEffectHash) {
                await prisma.hexaCoreSkillEffect.upsert({
                  where: {
                    hexaCoreSkillId_level: {
                      hexaCoreSkillId,
                      level: core.coreLevel + 1,
                    },
                  },
                  create: {
                    hexaCoreSkillId,
                    level: core.coreLevel + 1,
                    effect: skill.nextEffect,
                    hash: skill.nextEffectHash,
                  },
                  update: {
                    effect: skill.nextEffect,
                    hash: skill.nextEffectHash,
                  },
                });
              }
            }
          }
        }
      });
    } catch (error) {
      throw new Error(`헥사 매트릭스 생성 중 오류 발생: ${error.message}`);
    }
  }
}
