import { Injectable } from '@nestjs/common';
import { CharacterSkillCoreDto } from 'src/common/dto/skill-core.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SkillCoreRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createOrIgnoreSkillCore(skillCores: CharacterSkillCoreDto[]) {
    if (!skillCores?.length) return;

    for (const core of skillCores) {
      const existingCore = await this.prisma.skillCore.findFirst({
        where: { coreName: core.skillCore.coreName },
      });

      if (existingCore && existingCore.hash === core.skillCore.hash) continue;

      try {
        await this.prisma.skillCore.create({
          data: {
            hash: core.skillCore.hash,
            grade: core.skillCore.grade,
            coreName: core.skillCore.coreName,
            coreType: core.skillCore.coreType,
            coreSkill: core.skillCore.coreSkill,
          },
        });
      } catch (e) {
        if (e.code === 'P2002') continue;
        throw e;
      }
    }
  }
}
