/*
{
  "date": null,
  "character_class": "비숍",
  "final_stat": [
    {
      "stat_name": "최소 스탯공격력",
      "stat_value": "37261606"
    },
    {
      "stat_name": "최대 스탯공격력",
      "stat_value": "39222741"
    },
    {
      "stat_name": "데미지",
      "stat_value": "72.00"
    },
    // ...
  ],
  "remain_ap": 0
}
*/

import { CharacterStat } from '../type/character-stat.type';

export const characterStatMapper = (statData: object): CharacterStat[] => {
  const statList: CharacterStat[] = statData['final_stat'].map((stat: object): CharacterStat => {
    return {
      statName: stat['stat_name'],
      statValue: parseFloat(stat['stat_value']),
    };
  });
  statList.push({
    statName: 'remain_ap',
    statValue: parseFloat(statData['remain_ap']),
  });

  return statList;
};
