import { Injectable } from '@nestjs/common';
import { AbilityDto } from 'src/common/dto/ability.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { convertAbilityToEntity } from '../converter/ability.converter';

@Injectable()
export class AbilityRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createOrIgnoreAbility(ability: AbilityDto) {
    const flatAbility = convertAbilityToEntity(ability);
    const uniqueAbilities = Array.from(new Map(flatAbility.map((ab) => [ab.abilityValue, ab])).values());

    const existingAbilities = await this.prismaService.ability.findMany({
      where: {
        abilityValue: { in: uniqueAbilities.map((ab) => ab.abilityValue) },
      },
      select: { abilityValue: true },
    });

    const newAbilities = uniqueAbilities
      .filter((ab) => !existingAbilities.some((eab) => eab.abilityValue === ab.abilityValue))
      .map((ab) => ({ abilityGrade: ab.abilityGrade, abilityValue: ab.abilityValue }));
    return this.prismaService.ability.createMany({
      data: newAbilities,
      skipDuplicates: true,
    });
  }
}
