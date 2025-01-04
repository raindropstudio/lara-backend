import { Injectable } from '@nestjs/common';
import { CharacterLinkSkillDto } from 'src/common/dto/link-skill.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LinkSkillRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createOrIgnoreLinkSkill(linkSkills: CharacterLinkSkillDto[]) {
    if (!linkSkills?.length) return;

    const allSkillData = linkSkills.flatMap((linkSkill) => [
      // 보유 스킬
      {
        hash: linkSkill.ownedSkill.hash,
        name: linkSkill.ownedSkill.name,
        description: linkSkill.ownedSkill.description,
        level: linkSkill.ownedSkill.level,
        icon: linkSkill.ownedSkill.icon,
        effect: linkSkill.ownedSkill.effect,
        effectNext: linkSkill.ownedSkill.effectNext,
        grade: 'link',
      },
      // 링크 스킬들
      ...linkSkill.skill.map((skill) => ({
        hash: skill.hash,
        name: skill.name,
        description: skill.description,
        level: skill.level,
        icon: skill.icon,
        effect: skill.effect,
        effectNext: skill.effectNext,
        grade: 'link',
      })),
    ]);

    for (const skill of allSkillData) {
      const existingSkill = await this.prisma.skill.findFirst({
        where: { icon: skill.icon, level: skill.level },
      });

      if (existingSkill && existingSkill.hash === skill.hash) continue;

      try {
        await this.prisma.skill.create({
          data: skill,
        });
      } catch (e) {
        if (e.code === 'P2002') continue;
        throw e;
      }
    }
  }
}
