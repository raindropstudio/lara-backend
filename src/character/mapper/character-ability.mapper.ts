import { NxapiAbilityData } from 'src/nxapi/type/nxapi-ability.type';
import { CharacterAbility } from '../type/character-ability.type';
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
export const characterAbilityMapper = (abilityData: NxapiAbilityData): CharacterAbility[] => {
  const mapAbilityGrade = (grade: string): 'LEGENDARY' | 'UNIQUE' | 'EPIC' => {
    switch (grade) {
      case '레전드리':
        return 'LEGENDARY';
      case '유니크':
        return 'UNIQUE';
      case '에픽':
        return 'EPIC';
      default:
        throw new Error(`Unknown ability grade: ${grade}`);
    }
  };

  const mapAbilities = (abilities: any[], presetNo: number, isActive: boolean): CharacterAbility => {
    if (!abilities) return null;
    return {
      presetNo,
      active: isActive,
      ability: abilities.map((ability) => ({
        abilityNo: parseInt(ability.ability_no, 10),
        abilityGrade: mapAbilityGrade(ability.ability_grade),
        abilityValue: ability.ability_value,
      })),
    };
  };

  const characterAbility: CharacterAbility[] = [];

  const presetAbilities1 =
    abilityData.preset_no === null
      ? mapAbilities(abilityData.ability_info, 1, true)
      : mapAbilities(abilityData.ability_preset_1.ability_info, 1, abilityData.preset_no === 1);

  const presetAbilities2 = mapAbilities(abilityData.ability_preset_2.ability_info, 2, abilityData.preset_no === 2);
  const presetAbilities3 = mapAbilities(abilityData.ability_preset_3.ability_info, 3, abilityData.preset_no === 3);

  characterAbility.push(presetAbilities1);
  if (presetAbilities2) characterAbility.push(presetAbilities2);
  if (presetAbilities3) characterAbility.push(presetAbilities3);

  return characterAbility;
};
