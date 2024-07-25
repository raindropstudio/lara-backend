export interface CharacterHyperStat {
  id?: number;
  characterId?: number;
  statType: string;
  statPoint: number;
  statLevel?: number;
  statIncrease?: string;
  preset?: number;
  active?: boolean;
}
