import { Injectable } from '@nestjs/common';
import { HyperStatPresetDto } from 'src/common/dto/hyper-stat.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { convertHyperStatToEntity } from '../converter/hyper-stat.converter';

@Injectable()
export class HyperStatRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createOrIgnoreHyperstat(hyperStats: HyperStatPresetDto[]) {
    // ON CONFLICT 시 auto_increment가 너무 많이 튀는거 방지용
    // 캐릭터가 많아질수록 insert 할 행이 줄고, 경쟁조건이 많이 없을것으로 예상해서 이정도로 처리

    const flatHyperStats = convertHyperStatToEntity(hyperStats);
    // 들어온 값에서 중복유무 체크
    const uniqueHyperStats = Array.from(
      new Map(flatHyperStats.map((hs) => [hs.statType + '-' + hs.statPoint, hs])).values(),
    );

    const existingHyperStats = await this.prismaService.hyperStat.findMany({
      where: {
        OR: uniqueHyperStats.map((hs) => ({
          statType: hs.statType,
          statPoint: hs.statPoint,
        })),
      },
      select: { statType: true, statPoint: true },
    });

    const newHyperStats = uniqueHyperStats
      .filter((hs) => !existingHyperStats.some((ehs) => ehs.statType === hs.statType && ehs.statPoint === hs.statPoint))
      .map(({ presetNo, active, ...hyperStat }) => ({ ...hyperStat }));
    return this.prismaService.hyperStat.createMany({
      data: newHyperStats,
      skipDuplicates: true,
    });
  }
}
