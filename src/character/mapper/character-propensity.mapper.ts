/*
{
  "date": null,
  "charisma_level": 100,
  "sensibility_level": 100,
  "insight_level": 100,
  "willingness_level": 100,
  "handicraft_level": 100,
  "charm_level": 100
}
*/

import { CharacterPropensity } from '../type/character-propensity.type';

export const characterPropensityMapper = (propensityData: object): CharacterPropensity => {
  const characterPropensity: CharacterPropensity = {
    charismaLevel: propensityData['charisma_level'],
    sensibilityLevel: propensityData['sensibility_level'],
    insightLevel: propensityData['insight_level'],
    willingnessLevel: propensityData['willingness_level'],
    handicraftLevel: propensityData['handicraft_level'],
    charmLevel: propensityData['charm_level'],
  };
  return characterPropensity;
};
