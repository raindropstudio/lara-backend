import { CharacterBasic } from './character-basic.type';
import { CharacterStat } from './character-stat.type';

export interface Character extends CharacterBasic {
  stat: CharacterStat[];
}
