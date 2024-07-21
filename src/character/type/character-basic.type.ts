export interface CharacterBasic {
  ocid: string;
  nickname: string;
  worldName: string;
  gender: string;
  class: string;
  classLevel: number;
  level: number;
  exp: bigint;
  expRate: number;
  guildName: string;
  imageUrl: string;
  dateCreate: Date;
  accessFlag: boolean;
  liberationQuestClear: boolean;
  popularity: number;
  updatedAt: Date;
}
