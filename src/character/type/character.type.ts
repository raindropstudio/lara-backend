import { CharacterBasic } from './character-basic.type';
import { CharacterHyperStat } from './character-hyper-stat.type';
import { CharacterStat } from './character-stat.type';
import { CharacterPropensity } from './character-propensity.type';
import { CharacterAbility } from './character-ability.type';

export interface Character extends CharacterBasic {
  stat: CharacterStat[];
  hyperStat: CharacterHyperStat[];
  propensity: CharacterPropensity;
  ability: CharacterAbility[];
}
