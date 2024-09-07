import { Prisma } from '@prisma/client';
import { HyperStatInfoDto, HyperStatPresetDto } from 'src/common/dto/hyper-stat.dto';

type HyperStatEntity = Prisma.CharacterGetPayload<{
  include: {
    hyperStatPreset: {
      include: {
        hyperStat: true;
      };
    };
  };
}>['hyperStatPreset'];
type HyperStatFlatten = HyperStatInfoDto & { presetNo: number; active: boolean };

export const convertHyperStatToEntity = (hyperStatPreset: HyperStatPresetDto[]): HyperStatFlatten[] => {
  return hyperStatPreset.flatMap((hyperStatInfo) => {
    return hyperStatInfo.hyperStatInfo
      .map((hyperStat) => {
        return {
          ...hyperStat,
          presetNo: hyperStatInfo.presetNo,
          active: hyperStatInfo.active,
        };
      })
      .concat({
        statType: '_REMAIN_POINT',
        statPoint: hyperStatInfo.remainPoint,
        presetNo: hyperStatInfo.presetNo,
        active: hyperStatInfo.active,
      });
  });
};

export const convertHyperStatToDto = (hyperStatEntity: HyperStatEntity): HyperStatPresetDto[] => {
  if (!hyperStatEntity) return null;

  const hyperStatPresets = [
    { presetNo: 1, active: false, remainPoint: 0, hyperStatInfo: [] },
    { presetNo: 2, active: false, remainPoint: 0, hyperStatInfo: [] },
    { presetNo: 3, active: false, remainPoint: 0, hyperStatInfo: [] },
  ];

  if (hyperStatEntity) {
    hyperStatEntity.forEach((hs) => {
      const preset = hyperStatPresets.find((p) => p.presetNo === hs.presetNo);
      if (preset) {
        preset.active = hs.active; // 활성화 여부 설정
        if (hs.hyperStat.statType === '_REMAIN_POINT') {
          preset.remainPoint = hs.hyperStat.statPoint;
        } else {
          preset.hyperStatInfo.push(hs.hyperStat);
        }
      }
    });
  }

  return hyperStatPresets;
};
