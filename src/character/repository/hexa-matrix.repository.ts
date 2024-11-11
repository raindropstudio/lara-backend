import { Injectable } from '@nestjs/common';
import { HexaCoreType } from '@prisma/client';
import { createHash } from 'crypto';
import { HexaMatrixDto } from 'src/common/dto/hexa-matrix.dto';
import { PrismaService } from 'src/prisma/prisma.service';

const coreTypeMapToEnum: Record<string, HexaCoreType> = {
  '마스터리 코어': 'MASTERY_CORE',
  '스킬 코어': 'SKILL_CORE',
  '강화 코어': 'ENHANCEMENT_CORE',
  '공용 코어': 'COMMON_CORE',
};

@Injectable()
export class HexaMatrixRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createOrIgnoreHexaMatrix(hexaMatrix: HexaMatrixDto) {
    try {
      await this.prismaService.$transaction(async (prisma) => {
        // HexaCore 마스터 데이터 생성
        await prisma.hexaCore.createMany({
          data: hexaMatrix.cores.map((core) => ({
            characterClass: hexaMatrix.characterClass,
            coreName: core.coreName,
            coreType: coreTypeMapToEnum[core.coreType],
            description: core.skills[0]?.description ?? null,
            descriptionHash: core.skills[0]?.description
              ? createHash('sha256').update(core.skills[0].description).digest('hex')
              : null,
          })),
          skipDuplicates: true,
        });

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

        // HexaCoreSkill 마스터 데이터 생성
        const skillData = hexaMatrix.cores.flatMap((core) =>
          core.skills.map((skill) => ({
            hexaCoreId: hexaCoreMap.get(`${hexaMatrix.characterClass}_${core.coreName}`),
            skillName: skill.skillName,
            skillIcon: skill.skillIcon,
            iconHash: skill.skillIcon ? createHash('sha256').update(skill.skillIcon).digest('hex') : null,
          })),
        );

        await prisma.hexaCoreSkill.createMany({
          data: skillData,
          skipDuplicates: true,
        });

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

        // HexaCoreSkillEffect 마스터 데이터 생성
        const skillEffects = hexaMatrix.cores.flatMap((core) =>
          core.skills.flatMap((skill) => {
            const hexaCoreId = hexaCoreMap.get(`${hexaMatrix.characterClass}_${core.coreName}`);
            const hexaCoreSkillId = skillMap.get(`${hexaCoreId}_${skill.skillName}`);

            return [
              // 현재 레벨 효과
              {
                hexaCoreSkillId,
                level: core.coreLevel,
                effect: skill.currentEffect,
                hash: createHash('sha256')
                  .update(`${hexaCoreSkillId}_${core.coreLevel}_${skill.currentEffect}`)
                  .digest('hex'),
              },
              // 다음 레벨 효과 (있는 경우에만)
              ...(skill.nextEffect
                ? [
                    {
                      hexaCoreSkillId,
                      level: core.coreLevel + 1,
                      effect: skill.nextEffect,
                      hash: createHash('sha256')
                        .update(`${hexaCoreSkillId}_${core.coreLevel + 1}_${skill.nextEffect}`)
                        .digest('hex'),
                    },
                  ]
                : []),
            ];
          }),
        );

        await prisma.hexaCoreSkillEffect.createMany({
          data: skillEffects,
          skipDuplicates: true,
        });
      });
    } catch (error) {
      throw new Error(`헥사 매트릭스 생성 중 오류 발생: ${error.message}`);
    }
  }
}
