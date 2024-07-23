export interface CharacterBasic {
  // id?: number;
  ocid: string;
  nickname: string;
  worldName: string;
  gender: string;
  class: string;
  classLevel: string;
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
