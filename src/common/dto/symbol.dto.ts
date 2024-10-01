import { Expose } from 'class-transformer';

export class SymbolDto {
  @Expose()
  name: string;

  @Expose()
  force: number;

  @Expose()
  level: number;

  @Expose()
  str: number;

  @Expose()
  dex: number;

  @Expose()
  int: number;

  @Expose()
  luk: number;

  @Expose()
  hp: number;

  @Expose()
  dropRate: number;

  @Expose()
  mesoRate: number;

  @Expose()
  expRate: number;

  @Expose()
  growthCount: number;

  @Expose()
  requireGrowthCount: number;
}
