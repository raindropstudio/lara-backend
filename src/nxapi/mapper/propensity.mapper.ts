import { PropensityDto } from 'src/common/dto/propensity.dto';

export const propensityMapper = (propensityData: object): PropensityDto => {
  const characterPropensity: PropensityDto = {
    charismaLevel: propensityData['charisma_level'],
    sensibilityLevel: propensityData['sensibility_level'],
    insightLevel: propensityData['insight_level'],
    willingnessLevel: propensityData['willingness_level'],
    handicraftLevel: propensityData['handicraft_level'],
    charmLevel: propensityData['charm_level'],
  };
  return characterPropensity;
};
