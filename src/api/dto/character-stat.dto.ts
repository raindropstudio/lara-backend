import { Expose } from 'class-transformer';
import { IsInt, IsNumber, IsOptional } from 'class-validator';

export class CharacterStatDTO {
  @Expose()
  @IsOptional()
  @IsInt()
  maxStatAttackPower: number | null; // 최대 스탯공격력

  @Expose()
  @IsOptional()
  @IsInt()
  minStatAttackPower: number | null; // 최소 스탯공격력

  @Expose()
  @IsOptional()
  @IsNumber()
  damage: number | null; // 데미지

  @Expose()
  @IsOptional()
  @IsNumber()
  bossMonsterDamage: number | null; // 보스 몬스터 데미지

  @Expose()
  @IsOptional()
  @IsNumber()
  finalDamage: number | null; // 최종 데미지

  @Expose()
  @IsOptional()
  @IsNumber()
  ignoreDefenseRate: number | null; // 방어율 무시

  @Expose()
  @IsOptional()
  @IsInt()
  criticalRate: number | null; // 크리티컬 확률

  @Expose()
  @IsOptional()
  @IsNumber()
  criticalDamage: number | null; // 크리티컬 데미지

  @Expose()
  @IsOptional()
  @IsInt()
  abnormalStatusResistance: number | null; // 상태이상 내성

  @Expose()
  @IsOptional()
  @IsInt()
  stance: number | null; // 스탠스

  @Expose()
  @IsOptional()
  @IsInt()
  defense: number | null; // 방어력

  @Expose()
  @IsOptional()
  @IsInt()
  moveSpeed: number | null; // 이동속도

  @Expose()
  @IsOptional()
  @IsInt()
  jumpPower: number | null; // 점프력

  @Expose()
  @IsOptional()
  @IsInt()
  starForce: number | null; // 스타포스

  @Expose()
  @IsOptional()
  @IsInt()
  arcaneForce: number | null; // 아케인포스

  @Expose()
  @IsOptional()
  @IsInt()
  authenticForce: number | null; // 어센틱포스

  @Expose()
  @IsOptional()
  @IsInt()
  str: number | null; // STR

  @Expose()
  @IsOptional()
  @IsInt()
  dex: number | null; // DEX

  @Expose()
  @IsOptional()
  @IsInt()
  int: number | null; // INT

  @Expose()
  @IsOptional()
  @IsInt()
  luk: number | null; // LUK

  @Expose()
  @IsOptional()
  @IsInt()
  hp: number | null; // HP

  @Expose()
  @IsOptional()
  @IsInt()
  mp: number | null; // MP

  @Expose()
  @IsOptional()
  @IsInt()
  apStr: number | null; // AP 배분 STR

  @Expose()
  @IsOptional()
  @IsInt()
  apDex: number | null; // AP 배분 DEX

  @Expose()
  @IsOptional()
  @IsInt()
  apInt: number | null; // AP 배분 INT

  @Expose()
  @IsOptional()
  @IsInt()
  apLuk: number | null; // AP 배분 LUK

  @Expose()
  @IsOptional()
  @IsInt()
  apHp: number | null; // AP 배분 HP

  @Expose()
  @IsOptional()
  @IsInt()
  apMp: number | null; // AP 배분 MP

  @Expose()
  @IsOptional()
  @IsInt()
  itemDropRate: number | null; // 아이템 드롭률

  @Expose()
  @IsOptional()
  @IsInt()
  mesoAcquisition: number | null; // 메소 획득량

  @Expose()
  @IsOptional()
  @IsInt()
  buffDuration: number | null; // 버프 지속시간

  @Expose()
  @IsOptional()
  @IsInt()
  attackSpeed: number | null; // 공격 속도

  @Expose()
  @IsOptional()
  @IsNumber()
  normalMonsterDamage: number | null; // 일반 몬스터 데미지

  @Expose()
  @IsOptional()
  @IsInt()
  cooldownReductionPercent: number | null; // 재사용 대기시간 감소 (%)

  @Expose()
  @IsOptional()
  @IsInt()
  cooldownReductionSeconds: number | null; // 재사용 대기시간 감소 (초)

  @Expose()
  @IsOptional()
  @IsInt()
  cooldownExemption: number | null; // 재사용 대기시간 미적용

  @Expose()
  @IsOptional()
  @IsNumber()
  ignoreAttributeResistance: number | null; // 속성 내성 무시

  @Expose()
  @IsOptional()
  @IsNumber()
  abnormalStatusAdditionalDamage: number | null; // 상태이상 추가 데미지

  @Expose()
  @IsOptional()
  @IsInt()
  weaponMastery: number | null; // 무기 숙련도

  @Expose()
  @IsOptional()
  @IsNumber()
  additionalExp: number | null; // 추가 경험치 획득

  @Expose()
  @IsOptional()
  @IsInt()
  attackPower: number | null; // 공격력

  @Expose()
  @IsOptional()
  @IsInt()
  magicPower: number | null; // 마력

  @Expose()
  @IsOptional()
  @IsInt()
  combatPower: number | null; // 전투력

  @Expose()
  @IsOptional()
  @IsInt()
  summonDurationIncrease: number | null; // 소환수 지속시간 증가

  @Expose()
  @IsOptional()
  @IsInt()
  remainAp: number | null; // 남은 AP 포인트
}
