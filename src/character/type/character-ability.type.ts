export interface CharacterAbility {
  id?: number;
  ability: Ability[];
  presetNo: number;
  active: boolean;
}

export interface Ability {
  abilityNo: number;
  abilityGrade: 'LEGENDARY' | 'UNIQUE' | 'EPIC';
  abilityValue: string;
}
