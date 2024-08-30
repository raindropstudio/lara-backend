export interface CharacterHyperStat {
  id?: number;
  hyperStat: HyperStat[];
  presetNo?: number;
  active?: boolean;
}

export interface HyperStat {
  statType: string;
  statLevel?: number;
  statPoint: number;
  statIncrease?: string;
}
