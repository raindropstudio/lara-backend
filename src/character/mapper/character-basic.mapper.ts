import { CharacterBasic } from '../type/character-basic.type';

/*
{
  "date": null,
  "character_name": "소주에보드카",
  "world_name": "엘리시움",
  "character_gender": "여",
  "character_class": "비숍",
  "character_class_level": "6",
  "character_level": 281,
  "character_exp": 20772236593898,
  "character_exp_rate": "56.122",
  "character_guild_name": "Woden",
  "character_image": "https://open.api.nexon.com/static/maplestory/Character/EDNFMKBAIGMIMALKPHMANHDIFMBCFHPNPGFELMGNPNJLFAHFAPPCKLGMJHIOEOEEOOJMBLHKDODCELGKGCELBJPGCAGLKAJBJNGJGMKBGLFKMKEFMANPJKCLOGGEMGKBDAODIHIPFDLPPJGDCOGDBOCBFANOEKIDKGCKFBJMDNBJCJPIPPPOEBFKLJNPGOFCGELFPLDBKJGOPJMMLKAOJEHCAGMOKDOPJNJCNLEOCFNDPNCFKHLFKCOEBODLKPBH.png",
  "character_date_create": "2018-06-27T00:00+09:00",
  "access_flag": "true",
  "liberation_quest_clear_flag": "true"
}
*/

const extractCharacterImageCode = (imageUrl: string): string => {
  const url = new URL(imageUrl);
  const path = url.pathname;
  const code = path.split('/').pop().split('.')[0];
  return code;
};

export const characterBasicMapper = (ocid: string, basicData: object, popularityData: object): CharacterBasic => {
  const characterBasic: CharacterBasic = {
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
    imageUrl: extractCharacterImageCode(basicData['character_image']),
    dateCreate: new Date(basicData['character_date_create']),
    accessFlag: basicData['access_flag'] === 'true',
    liberationQuestClear: basicData['liberation_quest_clear_flag'] === 'true',
    popularity: popularityData['popularity'],
    updatedAt: basicData['date'] ? new Date(basicData['date']) : new Date(),
  };
  return characterBasic;
};
