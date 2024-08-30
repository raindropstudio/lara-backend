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

export const characterStatMapper = (statData: any): CharacterStat => {
  const statMapping: { [key: string]: keyof CharacterStat } = {
    '최대 스탯공격력': 'maxStatAttackPower',
    '최소 스탯공격력': 'minStatAttackPower',
    데미지: 'damage',
    '보스 몬스터 데미지': 'bossMonsterDamage',
    '최종 데미지': 'finalDamage',
    '방어율 무시': 'ignoreDefenseRate',
    '크리티컬 확률': 'criticalRate',
    '크리티컬 데미지': 'criticalDamage',
    '상태이상 내성': 'abnormalStatusResistance',
    스탠스: 'stance',
    방어력: 'defense',
    이동속도: 'moveSpeed',
    점프력: 'jumpPower',
    스타포스: 'starForce',
    아케인포스: 'arcaneForce',
    어센틱포스: 'authenticForce',
    STR: 'str',
    DEX: 'dex',
    INT: 'int',
    LUK: 'luk',
    HP: 'hp',
    MP: 'mp',
    'AP 배분 STR': 'apStr',
    'AP 배분 DEX': 'apDex',
    'AP 배분 INT': 'apInt',
    'AP 배분 LUK': 'apLuk',
    'AP 배분 HP': 'apHp',
    'AP 배분 MP': 'apMp',
    '아이템 드롭률': 'itemDropRate',
    '메소 획득량': 'mesoAcquisition',
    '버프 지속시간': 'buffDuration',
    '공격 속도': 'attackSpeed',
    '일반 몬스터 데미지': 'normalMonsterDamage',
    '재사용 대기시간 감소 (%)': 'cooldownReductionPercent',
    '재사용 대기시간 감소 (초)': 'cooldownReductionSeconds',
    '재사용 대기시간 미적용': 'cooldownExemption',
    '속성 내성 무시': 'ignoreAttributeResistance',
    '상태이상 추가 데미지': 'abnormalStatusAdditionalDamage',
    '무기 숙련도': 'weaponMastery',
    '추가 경험치 획득': 'additionalExp',
    공격력: 'attackPower',
    마력: 'magicPower',
    전투력: 'combatPower',
    '소환수 지속시간 증가': 'summonDurationIncrease',
  };

  const characterStat: CharacterStat = {};

  statData.final_stat.forEach((stat: { stat_name: string; stat_value: string }) => {
    const key = statMapping[stat.stat_name];
    if (key) {
      characterStat[key] = isNaN(Number(stat.stat_value)) ? null : Number(stat.stat_value);
    } else {
      console.warn(`Unknown stat name: ${stat.stat_name}`);
    }
  });

  characterStat.remainAp = statData.remain_ap ?? null;

  return characterStat;
};
