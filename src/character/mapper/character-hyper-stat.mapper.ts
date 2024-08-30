import { CharacterHyperStat } from '../type/character-hyper-stat.type';

/*
{
  "date": null,
  "character_class": "비숍",
  "use_preset_no": "1",
  "use_available_hyper_stat": 1364,
  "hyper_stat_preset_1": [
    {
      "stat_type": "STR",
      "stat_point": null,
      "stat_level": 0,
      "stat_increase": null
    },
    {
      "stat_type": "DEX",
      "stat_point": null,
      "stat_level": 0,
      "stat_increase": null
    },
    // ...
  ],
  "hyper_stat_preset_1_remain_point": 84,
  "hyper_stat_preset_2": [
    // 프리셋 1과 동일구조
  ],
  "hyper_stat_preset_2_remain_point": 151,
  "hyper_stat_preset_3": [
    // 프리셋 1과 동일구조
  ],
  "hyper_stat_preset_3_remain_point": 120
}
*/

export const characterHyperStatMapper = (hyperStatData: any): CharacterHyperStat[] => {
  const createHyperStats = (preset: any[], presetNo: number, remainPoint: number): CharacterHyperStat => {
    return {
      presetNo: presetNo,
      active: hyperStatData.use_preset_no === String(presetNo),
      hyperStat: [
        ...preset
          .filter((stat: any) => stat.stat_point)
          .map((stat: any) => ({
            statType: stat.stat_type,
            statLevel: stat.stat_level,
            statPoint: stat.stat_point,
            statIncrease: stat.stat_increase,
          })),
        {
          statType: 'remainPoint', // 남은 포인트
          statLevel: null,
          statPoint: remainPoint, // 남은 포인트 값
          statIncrease: null,
        },
      ],
    };
  };

  const characterHyperStats: CharacterHyperStat[] = [
    createHyperStats(hyperStatData.hyper_stat_preset_1, 1, hyperStatData.hyper_stat_preset_1_remain_point),
    createHyperStats(hyperStatData.hyper_stat_preset_2, 2, hyperStatData.hyper_stat_preset_2_remain_point),
    createHyperStats(hyperStatData.hyper_stat_preset_3, 3, hyperStatData.hyper_stat_preset_3_remain_point),
  ];

  return characterHyperStats;
};
