import { Expose } from 'class-transformer';
import { IsInt, IsNumber, IsOptional } from 'class-validator';

export class CharacterStatDTO {
  @Expose()
  @IsOptional()
  @IsInt()
  maxStatAttackPower?: number; // 최대 스탯공격력

  @Expose()
  @IsOptional()
  @IsInt()
  minStatAttackPower?: number; // 최소 스탯공격력

  @Expose()
  @IsOptional()
  @IsNumber()
  damage?: number; // 데미지

  @Expose()
  @IsOptional()
  @IsNumber()
  bossMonsterDamage?: number; // 보스 몬스터 데미지

  @Expose()
  @IsOptional()
  @IsNumber()
  finalDamage?: number; // 최종 데미지

  @Expose()
  @IsOptional()
  @IsNumber()
  ignoreDefenseRate?: number; // 방어율 무시

  @Expose()
  @IsOptional()
  @IsInt()
  criticalRate?: number; // 크리티컬 확률

  @Expose()
  @IsOptional()
  @IsNumber()
  criticalDamage?: number; // 크리티컬 데미지

  @Expose()
  @IsOptional()
  @IsInt()
  abnormalStatusResistance?: number; // 상태이상 내성

  @Expose()
  @IsOptional()
  @IsInt()
  stance?: number; // 스탠스

  @Expose()
  @IsOptional()
  @IsInt()
  defense?: number; // 방어력

  @Expose()
  @IsOptional()
  @IsInt()
  moveSpeed?: number; // 이동속도

  @Expose()
  @IsOptional()
  @IsInt()
  jumpPower?: number; // 점프력

  @Expose()
  @IsOptional()
  @IsInt()
  starForce?: number; // 스타포스

  @Expose()
  @IsOptional()
  @IsInt()
  arcaneForce?: number; // 아케인포스

  @Expose()
  @IsOptional()
  @IsInt()
  authenticForce?: number; // 어센틱포스

  @Expose()
  @IsOptional()
  @IsInt()
  str?: number; // STR

  @Expose()
  @IsOptional()
  @IsInt()
  dex?: number; // DEX

  @Expose()
  @IsOptional()
  @IsInt()
  int?: number; // INT

  @Expose()
  @IsOptional()
  @IsInt()
  luk?: number; // LUK

  @Expose()
  @IsOptional()
  @IsInt()
  hp?: number; // HP

  @Expose()
  @IsOptional()
  @IsInt()
  mp?: number; // MP

  @Expose()
  @IsOptional()
  @IsInt()
  apStr?: number; // AP 배분 STR

  @Expose()
  @IsOptional()
  @IsInt()
  apDex?: number; // AP 배분 DEX

  @Expose()
  @IsOptional()
  @IsInt()
  apInt?: number; // AP 배분 INT

  @Expose()
  @IsOptional()
  @IsInt()
  apLuk?: number; // AP 배분 LUK

  @Expose()
  @IsOptional()
  @IsInt()
  apHp?: number; // AP 배분 HP

  @Expose()
  @IsOptional()
  @IsInt()
  apMp?: number; // AP 배분 MP

  @Expose()
  @IsOptional()
  @IsInt()
  itemDropRate?: number; // 아이템 드롭률

  @Expose()
  @IsOptional()
  @IsInt()
  mesoAcquisition?: number; // 메소 획득량

  @Expose()
  @IsOptional()
  @IsInt()
  buffDuration?: number; // 버프 지속시간

  @Expose()
  @IsOptional()
  @IsInt()
  attackSpeed?: number; // 공격 속도

  @Expose()
  @IsOptional()
  @IsNumber()
  normalMonsterDamage?: number; // 일반 몬스터 데미지

  @Expose()
  @IsOptional()
  @IsInt()
  cooldownReductionPercent?: number; // 재사용 대기시간 감소 (%)

  @Expose()
  @IsOptional()
  @IsInt()
  cooldownReductionSeconds?: number; // 재사용 대기시간 감소 (초)

  @Expose()
  @IsOptional()
  @IsInt()
  cooldownExemption?: number; // 재사용 대기시간 미적용

  @Expose()
  @IsOptional()
  @IsNumber()
  ignoreAttributeResistance?: number; // 속성 내성 무시

  @Expose()
  @IsOptional()
  @IsNumber()
  abnormalStatusAdditionalDamage?: number; // 상태이상 추가 데미지

  @Expose()
  @IsOptional()
  @IsInt()
  weaponMastery?: number; // 무기 숙련도

  @Expose()
  @IsOptional()
  @IsNumber()
  additionalExp?: number; // 추가 경험치 획득

  @Expose()
  @IsOptional()
  @IsInt()
  attackPower?: number; // 공격력

  @Expose()
  @IsOptional()
  @IsInt()
  magicPower?: number; // 마력

  @Expose()
  @IsOptional()
  @IsInt()
  combatPower?: number; // 전투력

  @Expose()
  @IsOptional()
  @IsInt()
  summonDurationIncrease?: number; // 소환수 지속시간 증가

  @Expose()
  @IsOptional()
  @IsInt()
  remainAp?: number; // 남은 AP 포인트
}
