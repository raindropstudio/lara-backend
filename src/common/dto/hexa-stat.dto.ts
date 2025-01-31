import { Expose } from 'class-transformer';

export class HexaStatDto {
  hash: string;

  @Expose()
  hexaStatNo: number;

  @Expose()
  presetNo: number;

  @Expose()
  active: boolean;

  @Expose()
  mainStatName: string;

  @Expose()
  mainStatLevel: number;

  @Expose()
  subStat1Name: string;

  @Expose()
  subStat1Level: number;

  @Expose()
  subStat2Name: string;

  @Expose()
  subStat2Level: number;

  @Expose()
  statGrade: number;
}
