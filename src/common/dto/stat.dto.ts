import { Expose } from 'class-transformer';

export class StatDto {
  @Expose()
  maxStatAttackPower?: number; // 최대 스탯공격력

  @Expose()
  minStatAttackPower?: number; // 최소 스탯공격력

  @Expose()
  damage?: number; // 데미지

  @Expose()
  bossMonsterDamage?: number; // 보스 몬스터 데미지

  @Expose()
  finalDamage?: number; // 최종 데미지

  @Expose()
  ignoreDefenseRate?: number; // 방어율 무시

  @Expose()
  criticalRate?: number; // 크리티컬 확률

  @Expose()
  criticalDamage?: number; // 크리티컬 데미지

  @Expose()
  abnormalStatusResistance?: number; // 상태이상 내성

  @Expose()
  stance?: number; // 스탠스

  @Expose()
  defense?: number; // 방어력

  @Expose()
  moveSpeed?: number; // 이동속도

  @Expose()
  jumpPower?: number; // 점프력

  @Expose()
  starForce?: number; // 스타포스

  @Expose()
  arcaneForce?: number; // 아케인포스

  @Expose()
  authenticForce?: number; // 어센틱포스

  @Expose()
  str?: number; // STR

  @Expose()
  dex?: number; // DEX

  @Expose()
  int?: number; // INT

  @Expose()
  luk?: number; // LUK

  @Expose()
  hp?: number; // HP

  @Expose()
  mp?: number; // MP

  @Expose()
  apStr?: number; // AP 배분 STR

  @Expose()
  apDex?: number; // AP 배분 DEX

  @Expose()
  apInt?: number; // AP 배분 INT

  @Expose()
  apLuk?: number; // AP 배분 LUK

  @Expose()
  apHp?: number; // AP 배분 HP

  @Expose()
  apMp?: number; // AP 배분 MP

  @Expose()
  itemDropRate?: number; // 아이템 드롭률

  @Expose()
  mesoAcquisition?: number; // 메소 획득량

  @Expose()
  buffDuration?: number; // 버프 지속시간

  @Expose()
  attackSpeed?: number; // 공격 속도

  @Expose()
  normalMonsterDamage?: number; // 일반 몬스터 데미지

  @Expose()
  cooldownReductionPercent?: number; // 재사용 대기시간 감소 (%)

  @Expose()
  cooldownReductionSeconds?: number; // 재사용 대기시간 감소 (초)

  @Expose()
  cooldownExemption?: number; // 재사용 대기시간 미적용

  @Expose()
  ignoreAttributeResistance?: number; // 속성 내성 무시

  @Expose()
  abnormalStatusAdditionalDamage?: number; // 상태이상 추가 데미지

  @Expose()
  weaponMastery?: number; // 무기 숙련도

  @Expose()
  additionalExp?: number; // 추가 경험치 획득

  @Expose()
  attackPower?: number; // 공격력

  @Expose()
  magicPower?: number; // 마력

  @Expose()
  combatPower?: number; // 전투력

  @Expose()
  summonDurationIncrease?: number; // 소환수 지속시간 증가

  @Expose()
  remainAp?: number; // 남은 AP 포인트
}
