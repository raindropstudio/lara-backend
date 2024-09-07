import { HyperStatPresetDto } from 'src/common/dto/hyper-stat.dto';

export const hyperStatMapper = (hyperStatData: any): HyperStatPresetDto[] => {
  const createHyperStats = (preset: any[], presetNo: number, remainPoint: number): HyperStatPresetDto => {
    return {
      presetNo: presetNo,
      active: hyperStatData.use_preset_no === String(presetNo),
      remainPoint: remainPoint,
      hyperStatInfo: [
        ...preset
          .filter((stat: any) => stat.stat_point)
          .map((stat: any) => ({
            statType: stat.stat_type,
            statLevel: stat.stat_level,
            statPoint: stat.stat_point,
            statIncrease: stat.stat_increase,
          })),
      ],
    };
  };

  const characterHyperStats: HyperStatPresetDto[] = [
    createHyperStats(hyperStatData.hyper_stat_preset_1, 1, hyperStatData.hyper_stat_preset_1_remain_point),
    createHyperStats(hyperStatData.hyper_stat_preset_2, 2, hyperStatData.hyper_stat_preset_2_remain_point),
    createHyperStats(hyperStatData.hyper_stat_preset_3, 3, hyperStatData.hyper_stat_preset_3_remain_point),
  ];

  return characterHyperStats;
};
