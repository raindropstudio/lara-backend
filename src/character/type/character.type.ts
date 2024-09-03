import { CharacterAbility } from './character-ability.type';
import { CharacterBasic } from './character-basic.type';
import { CharacterHyperStat } from './character-hyper-stat.type';
import { CharacterItemEquipment } from './character-item-equipment.type';
import { CharacterPropensity } from './character-propensity.type';
import { CharacterStat } from './character-stat.type';

export interface Character extends CharacterBasic {
  stat: CharacterStat;
  hyperStatPreset: CharacterHyperStat[];
  propensity: CharacterPropensity;
  ability: CharacterAbility;
  itemEquipmentPreset: CharacterItemEquipment[];
}
