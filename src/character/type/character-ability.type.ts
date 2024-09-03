export interface CharacterAbility {
  remainFame: number;
  preset: AbilityPreset[];
}

export interface AbilityPreset {
  abilityInfo: AbilityInfo[];
  presetNo: number;
  active: boolean;
}

export interface AbilityInfo {
  abilityNo: number;
  abilityGrade: 'LEGENDARY' | 'UNIQUE' | 'EPIC' | 'RARE';
  abilityValue: string;
}
