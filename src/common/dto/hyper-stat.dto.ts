import { Expose, Type } from 'class-transformer';

export class HyperStatPresetDto {
  @Expose()
  @Type(() => HyperStatInfoDto)
  hyperStatInfo: HyperStatInfoDto[];

  @Expose()
  presetNo: number;

  @Expose()
  active: boolean;

  @Expose()
  remainPoint: number;
}

export class HyperStatInfoDto {
  @Expose()
  statType: string;

  @Expose()
  statPoint: number;

  @Expose()
  statLevel?: number;

  @Expose()
  statIncrease?: string;
}
