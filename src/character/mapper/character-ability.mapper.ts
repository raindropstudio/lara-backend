import { NxapiAbilityData } from 'src/nxapi/type/nxapi-ability.type';
import { AbilityPreset, CharacterAbility } from '../type/character-ability.type';
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
const mapAbilityGrade = (grade: string): 'LEGENDARY' | 'UNIQUE' | 'EPIC' | 'RARE' => {
  switch (grade) {
    case '레전드리':
      return 'LEGENDARY';
    case '유니크':
      return 'UNIQUE';
    case '에픽':
      return 'EPIC';
    case '레어':
      return 'RARE';
    default:
      throw new Error(`Unknown ability grade: ${grade}`);
  }
};

const mapAbilities = (abilities: any[], presetNo: number, isActive: boolean): AbilityPreset => {
  if (!abilities) return null;
  return {
    presetNo,
    active: isActive,
    abilityInfo: abilities.map((ability) => ({
      abilityNo: parseInt(ability.ability_no, 10),
      abilityGrade: mapAbilityGrade(ability.ability_grade),
      abilityValue: ability.ability_value,
    })),
  };
};

export const characterAbilityMapper = (abilityData: NxapiAbilityData): CharacterAbility => {
  const characterAbility: CharacterAbility = {
    remainFame: abilityData.remain_fame,
    preset: [],
  };

  const presetAbilities1 =
    abilityData.preset_no === null
      ? mapAbilities(abilityData.ability_info, 1, true)
      : mapAbilities(abilityData.ability_preset_1.ability_info, 1, abilityData.preset_no === 1);

  const presetAbilities2 = mapAbilities(abilityData.ability_preset_2.ability_info, 2, abilityData.preset_no === 2);
  const presetAbilities3 = mapAbilities(abilityData.ability_preset_3.ability_info, 3, abilityData.preset_no === 3);

  characterAbility.preset.push({
    presetNo: 0,
    active: false,
    abilityInfo: [
      {
        abilityNo: abilityData.remain_fame,
        abilityGrade: 'RARE', // Dummy (DB에 안들어감)
        abilityValue: 'REMAIN_FAME', // Dummy (DB에 안들어감)
      },
    ],
  });
  characterAbility.preset.push(presetAbilities1);
  if (presetAbilities2) characterAbility.preset.push(presetAbilities2);
  if (presetAbilities3) characterAbility.preset.push(presetAbilities3);

  return characterAbility;
};
