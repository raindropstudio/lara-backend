import { AbilityDto, AbilityPresetDto } from 'src/common/dto/ability.dto';
import { NxapiAbilityData } from 'src/nxapi/type/nxapi-ability.type';

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

const mapAbilities = (abilities: any[], presetNo: number, isActive: boolean): AbilityPresetDto => {
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

export const abilityMapper = (abilityData: NxapiAbilityData): AbilityDto => {
  const characterAbility: AbilityDto = {
    remainFame: abilityData.remain_fame,
    preset: [],
  };

  const presetAbilities1 =
    abilityData.preset_no === null
      ? mapAbilities(abilityData.ability_info, 1, true)
      : mapAbilities(abilityData.ability_preset_1.ability_info, 1, abilityData.preset_no === 1);

  const presetAbilities2 = mapAbilities(abilityData.ability_preset_2.ability_info, 2, abilityData.preset_no === 2);
  const presetAbilities3 = mapAbilities(abilityData.ability_preset_3.ability_info, 3, abilityData.preset_no === 3);

  characterAbility.preset.push(presetAbilities1);
  if (presetAbilities2) characterAbility.preset.push(presetAbilities2);
  if (presetAbilities3) characterAbility.preset.push(presetAbilities3);

  return characterAbility;
};
