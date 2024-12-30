import { Injectable } from '@nestjs/common';
import { CharacterSkillDto } from 'src/common/dto/skill.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SkillRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createOrIgnoreSkill(skills: CharacterSkillDto[]) {
    if (!skills?.length) return;

    for (const skill of skills) {
      const existingSkill = await this.prisma.skill.findFirst({
        where: { name: skill.name },
      });

      if (existingSkill && existingSkill.hash === skill.hash) continue;

      try {
        await this.prisma.skill.create({
          data: {
            hash: skill.hash,
            grade: skill.grade,
            name: skill.name,
            description: skill.description,
            level: skill.level,
            icon: skill.icon,
            effect: skill.effect,
            effectNext: skill.effectNext,
          },
        });
      } catch (e) {
        if (e.code === 'P2002') continue;
        throw e;
      }
    }
  }
}
