import { Injectable } from '@nestjs/common';
import { ItemOptionDto } from 'src/common/dto/item-equipment.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ItemOptionRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createOrIgnoreItemOption(itemOptions: ItemOptionDto[]) {
    const uniqueItemOptions = Array.from(new Map(itemOptions.map((io) => [io.hash, io])).values());

    const existingItemOptions = await this.prismaService.itemOption.findMany({
      where: {
        hash: { in: uniqueItemOptions.map((io) => io.hash) },
      },
      select: { hash: true },
    });

    const newOptions = uniqueItemOptions.filter((io) => !existingItemOptions.some((eio) => eio.hash === io.hash));
    return this.prismaService.itemOption.createMany({
      data: newOptions,
      skipDuplicates: true,
    });
  }
}
