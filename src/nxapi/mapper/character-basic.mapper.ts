import { CharacterBasicDto } from 'src/common/dto/character-basic.dto';
import { extractImageCode } from 'src/common/util/extract-image-code';

export const characterBasicMapper = (ocid: string, basicData: object, popularity?: number): CharacterBasicDto => {
  const characterBasic: CharacterBasicDto = {
    ocid,
    nickname: basicData['character_name'],
    worldName: basicData['world_name'],
    gender: basicData['character_gender'],
    class: basicData['character_class'],
    classLevel: basicData['character_class_level'],
    level: basicData['character_level'],
    exp: BigInt(basicData['character_exp']),
    expRate: parseFloat(basicData['character_exp_rate']),
    guildName: basicData['character_guild_name'],
    imageUrl: extractImageCode(basicData['character_image']),
    dateCreate: new Date(basicData['character_date_create']),
    accessFlag: basicData['access_flag'] === 'true',
    liberationQuestClear: basicData['liberation_quest_clear_flag'] === 'true',
    popularity: popularity || null,
    updatedAt: basicData['date'] ? new Date(basicData['date']) : new Date(),
  };
  return characterBasic;
};
