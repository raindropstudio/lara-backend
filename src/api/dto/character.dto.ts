import { Expose, Transform } from 'class-transformer';
import { IsBoolean, IsDate, IsInt, IsNumber, IsString, IsUrl } from 'class-validator';

export class CharacterDTO {
  constructor(partial: Partial<CharacterDTO>) {
    Object.assign(this, partial);
  }

  @Expose()
  @IsString()
  ocid: string;

  @Expose()
  @IsString()
  nickname: string;

  @Expose()
  @IsString()
  worldName: string;

  @Expose()
  @IsString()
  gender: string;

  @Expose()
  @IsString()
  class: string;

  @Expose()
  @IsInt()
  classLevel: number;

  @Expose()
  @IsInt()
  level: number;

  @Expose()
  @Transform(({ value }) => value.toString())
  @IsString()
  exp: bigint;

  @Expose()
  @IsNumber()
  expRate: number;

  @Expose()
  @IsString()
  guildName: string;

  @Expose()
  @IsUrl()
  imageUrl: string;

  @Expose()
  @IsDate()
  dateCreate: Date;

  @Expose()
  @IsBoolean()
  accessFlag: boolean;

  @Expose()
  @IsBoolean()
  liberationQuestClear: boolean;

  @Expose()
  @IsInt()
  popularity: number;

  @Expose()
  @IsDate()
  updatedAt: Date;
}
