import { Injectable } from '@nestjs/common';
import { HexaStatDto } from 'src/common/dto/hexa-stat.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class HexaStatRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createOrIgnoreHexaStat(hexaStats: HexaStatDto[]) {
    if (!hexaStats?.length) return;

    // 중복 제거된 헥사스텟 데이터 생성 (hash 기준)
    const uniqueHexaStats = Array.from(new Map(hexaStats.map((hs) => [hs.hash, hs])).values());

    for (const hexaStat of uniqueHexaStats) {
      // 기존 헥사스텟 존재 여부 확인
      const existingHexaStat = await this.prismaService.hexaStat.findUnique({
        where: { hash: hexaStat.hash },
      });

      // 이미 존재하는 헥사스텟이면 넘어감
      if (existingHexaStat) continue;

      // 안넣을것들 삭제
      const { presetNo, active, hexaStatNo, ...hexaStatOnly } = hexaStat;

      try {
        await this.prismaService.hexaStat.create({
          data: hexaStatOnly,
        });
      } catch (e) {
        if (e.code === 'P2002') continue;
        throw e;
      }
    }
  }
}
