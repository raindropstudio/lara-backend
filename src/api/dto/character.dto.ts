import { Expose, Transform, Type } from 'class-transformer';
import { IsBoolean, IsDate, IsInt, IsNumber, IsString, IsUrl, ValidateNested } from 'class-validator';
import { CharacterStatDTO } from './character-stat.dto';
import { CharacterHyperStatDTO } from './character-hyper-stat.dto';

export class CharacterDTO {
  constructor(partial: Partial<CharacterDTO>) {
    Object.assign(this, partial);
  }

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
  @IsString()
  classLevel: string;

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

  @Expose()
  @ValidateNested({ each: true })
  @Type(() => CharacterStatDTO)
  stat: CharacterStatDTO[];

  @Expose()
  @ValidateNested({ each: true })
  @Type(() => CharacterHyperStatDTO)
  hyperStat: CharacterHyperStatDTO[];
}
