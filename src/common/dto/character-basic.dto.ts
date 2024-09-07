import { Expose, Transform } from 'class-transformer';

export class CharacterBasicDto {
  ocid: string;

  @Expose()
  nickname: string;

  @Expose()
  worldName: string;

  @Expose()
  gender: string;

  @Expose()
  class: string;

  @Expose()
  classLevel: string;

  @Expose()
  level: number;

  @Expose()
  @Transform(({ value }) => value.toString())
  exp: bigint;

  @Expose()
  expRate: number;

  @Expose()
  guildName?: string;

  @Expose()
  imageUrl: string;

  @Expose()
  dateCreate?: Date;

  @Expose()
  accessFlag?: boolean;

  @Expose()
  liberationQuestClear: boolean;

  @Expose()
  popularity?: number;

  @Expose()
  updatedAt: Date;
}
