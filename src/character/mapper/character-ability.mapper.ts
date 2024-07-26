import { AbilityData, AbilityInfo, CharacterAbility } from '../type/character-ability.type';
/*
{
  "date": null,
  "ability_grade": "레전드리",
  "ability_info": [
    {
      "ability_no": "1",
      "ability_grade": "레전드리",
      "ability_value": "버프 스킬의 지속 시간 49% 증가"
    },
    {
      "ability_no": "2",
      "ability_grade": "유니크",
      "ability_value": "보스 몬스터 공격 시 데미지 9% 증가"
    },
    {
      "ability_no": "3",
      "ability_grade": "유니크",
      "ability_value": "상태 이상에 걸린 대상 공격 시 데미지 8% 증가"
    }
  ],
  "remain_fame": 1372430,
  "preset_no": 1,
  "ability_preset_1": {
    "ability_preset_grade": "레전드리",
    "ability_info": [
      {
        "ability_no": "1",
        "ability_grade": "레전드리",
        "ability_value": "버프 스킬의 지속 시간 49% 증가"
      },
      {
        "ability_no": "2",
        "ability_grade": "유니크",
        "ability_value": "보스 몬스터 공격 시 데미지 9% 증가"
      },
      {
        "ability_no": "3",
        "ability_grade": "유니크",
        "ability_value": "상태 이상에 걸린 대상 공격 시 데미지 8% 증가"
      }
    ]
  },
  "ability_preset_2": {
    "ability_preset_grade": "레전드리",
    "ability_info": [
      // 프리셋 1과 동일구조
    ]
  },
  "ability_preset_3": {
    "ability_preset_grade": "에픽",
    "ability_info": [
      // 프리셋 1과 동일구조
    ]
  }
}
*/
export const characterAbilityMapper = (abilityData: AbilityData): CharacterAbility[] => {
  const mainAbilities = abilityData.ability_info.map((ability: AbilityInfo) => ({
    abilityNo: parseInt(ability.ability_no, 10),
    abilityGrade: ability.ability_grade,
    abilityValue: ability.ability_value,
    remainFame: abilityData.remain_fame, // 남은 명성치
    active: true,
  }));

  const presetAbilities = [1, 2, 3]
    .map((presetNumber) => {
      const presetKey = `ability_preset_${presetNumber}`;
      const preset = abilityData[presetKey];

      return preset.ability_info.map((ability: AbilityInfo) => ({
        abilityNo: parseInt(ability.ability_no, 10), // NXAPI에서 ability_no가 string으로 와서 number로 변환...
        abilityGrade: ability.ability_grade,
        abilityValue: ability.ability_value,
        active: false,
        presetNo: presetNumber,
      }));
    })
    .flat();
  presetAbilities.push({
    abilityValue: '남은 명성치',
    remainFame: abilityData.remain_fame,
  });

  // 프리셋 중 현재 적용중인 어빌리티와 동일한 프리셋을 찾아서 active 속성을 true로 변경
  presetAbilities.forEach((ability: CharacterAbility) => {
    if (
      mainAbilities.some(
        (mainAbility) =>
          mainAbility.abilityNo === ability.abilityNo &&
          mainAbility.abilityGrade === ability.abilityGrade &&
          mainAbility.abilityValue === ability.abilityValue,
      )
    ) {
      ability.active = true;
    }
  });

  return presetAbilities;
};
