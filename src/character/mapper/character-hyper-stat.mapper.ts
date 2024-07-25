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

// character-hyper-stat.mapper.ts 파일

import { CharacterHyperStat } from '../type/character-hyper-stat.type';

export const characterHyperStatMapper = (hyperStatData: object): CharacterHyperStat[] => {
  const hyperStatList: CharacterHyperStat[] = [];

  for (let i = 1; i <= 3; i++) {
    const preset = i;
    const presetKey = `hyper_stat_preset_${i}`;
    const remainPointKey = `hyper_stat_preset_${i}_remain_point`;

    const filteredStatList = (hyperStatData[presetKey] || []).filter(
      (stat: object) => stat['stat_point'] !== null && stat['stat_level'] !== null && stat['stat_increase'] !== null,
    );

    const presetStatList = filteredStatList.map((stat: object): CharacterHyperStat => {
      return {
        active: hyperStatData['use_preset_no'] === `${i}`,
        statType: stat['stat_type'],
        statPoint: stat['stat_point'],
        statLevel: stat['stat_level'],
        statIncrease: stat['stat_increase'],
        preset,
      };
    });
    presetStatList.push({
      statType: 'use_available_hyper_stat',
      statPoint: hyperStatData['use_available_hyper_stat'],
    });
    presetStatList.push({
      statType: 'remain_point',
      statPoint: hyperStatData[remainPointKey],
    });

    hyperStatList.push(...presetStatList);
  }

  return hyperStatList;
};
