import { Prisma } from '@prisma/client';
import { HexaStatDto } from 'src/common/dto/hexa-stat.dto';

type HexaStatEntity = Prisma.CharacterGetPayload<{
  include: {
    hexaStat: {
      include: {
        hexaStat: true;
      };
    };
  };
}>['hexaStat'];

export function convertHexaStatToDto(hexaStatEntity: HexaStatEntity): HexaStatDto[] {
  if (!hexaStatEntity?.length) return [];

  return hexaStatEntity.map((hs) => ({
    hash: hs.hexaStat.hash,
    hexaStatNo: hs.hexaStatNo,
    presetNo: hs.presetNo,
    active: hs.active,
    mainStatName: hs.hexaStat.mainStatName,
    mainStatLevel: hs.hexaStat.mainStatLevel,
    subStat1Name: hs.hexaStat.subStat1Name,
    subStat1Level: hs.hexaStat.subStat1Level,
    subStat2Name: hs.hexaStat.subStat2Name,
    subStat2Level: hs.hexaStat.subStat2Level,
    statGrade: hs.hexaStat.statGrade,
  }));
}
