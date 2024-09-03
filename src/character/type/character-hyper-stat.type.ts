export interface CharacterHyperStat {
  // id?: number;
  hyperStatInfo: HyperStatInfo[];
  presetNo: number;
  active: boolean;
  remainPoint: number;
}

export interface HyperStatInfo {
  statType: string;
  statLevel?: number;
  statPoint: number;
  statIncrease?: string;
}
