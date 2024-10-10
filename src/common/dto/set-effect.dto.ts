import { Expose, Type } from 'class-transformer';

export class SetOptionDto {
  @Expose()
  setCount: number;

  @Expose()
  setOption: string;
}

export class SetEffectDto {
  hash: string;

  @Expose()
  setName: string;

  @Expose()
  @Type(() => SetOptionDto)
  setOptionList: SetOptionDto[];

  @Expose()
  setCount: number;
}
