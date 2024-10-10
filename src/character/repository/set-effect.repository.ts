import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { SetEffectDto } from 'src/common/dto/set-effect.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SetEffectRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createOrIgnoreSetEffect(setEffect: SetEffectDto[]) {
    // 세트효과 저장
    for (const setEff of setEffect) {
      // 세트효과는 이름으로 구분
      const existingSetEffect = await this.prismaService.setEffect.findFirst({
        where: { setName: setEff.setName },
      });

      // 해시가 일치하면 넘어감
      if (existingSetEffect && existingSetEffect.hash === setEff.hash) continue;

      try {
        await this.prismaService.setEffect.create({
          data: {
            hash: setEff.hash,
            setName: setEff.setName,
            setOptionList: setEff.setOptionList as unknown as Prisma.InputJsonValue,
          },
        });
      } catch (e) {
        if (e.code === 'P2002') continue;
        throw e;
      }
    }
  }
}
