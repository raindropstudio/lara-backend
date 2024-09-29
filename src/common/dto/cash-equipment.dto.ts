import { Expose, Type } from 'class-transformer';
import { ItemOptionDto } from './item-equipment.dto';

export class CashEquipmentInfoDto {
  @Expose()
  part: string;

  @Expose()
  slot: string;

  @Expose()
  name: string;

  @Expose()
  icon: string;

  @Expose()
  description?: string;

  @Expose()
  dateExpire?: Date;

  @Expose()
  dateOptionExpire?: Date;

  @Expose()
  label?: string;

  @Expose()
  itemGender?: string;

  @Expose()
  @Type(() => ItemOptionDto)
  option?: ItemOptionDto;

  @Expose()
  coloringPrismRange?: 'ALL' | 'RED' | 'YELLOW' | 'GREEN' | 'CYAN' | 'BLUE' | 'PURPLE';

  @Expose()
  coloringPrismHue?: number;

  @Expose()
  coloringPrismSaturation?: number;

  @Expose()
  coloringPrismValue?: number;
}

export class CashEquipmentPresetDto {
  @Expose()
  presetNo: number;

  @Expose()
  active: boolean;

  @Expose()
  @Type(() => CashEquipmentInfoDto)
  cashEquipmentInfo: CashEquipmentInfoDto[];
}
