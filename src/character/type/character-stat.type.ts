export interface CharacterStat {
  id?: number; // ID
  maxStatAttackPower?: number | null; // 최대 스탯공격력
  minStatAttackPower?: number | null; // 최소 스탯공격력
  damage?: number | null; // 데미지
  bossMonsterDamage?: number | null; // 보스 몬스터 데미지
  finalDamage?: number | null; // 최종 데미지
  ignoreDefenseRate?: number | null; // 방어율 무시
  criticalRate?: number | null; // 크리티컬 확률
  criticalDamage?: number | null; // 크리티컬 데미지
  abnormalStatusResistance?: number | null; // 상태이상 내성
  stance?: number | null; // 스탠스
  defense?: number | null; // 방어력
  moveSpeed?: number | null; // 이동속도
  jumpPower?: number | null; // 점프력
  starForce?: number | null; // 스타포스
  arcaneForce?: number | null; // 아케인포스
  authenticForce?: number | null; // 어센틱포스
  str?: number | null; // STR
  dex?: number | null; // DEX
  int?: number | null; // INT
  luk?: number | null; // LUK
  hp?: number | null; // HP
  mp?: number | null; // MP
  apStr?: number | null; // AP 배분 STR
  apDex?: number | null; // AP 배분 DEX
  apInt?: number | null; // AP 배분 INT
  apLuk?: number | null; // AP 배분 LUK
  apHp?: number | null; // AP 배분 HP
  apMp?: number | null; // AP 배분 MP
  itemDropRate?: number | null; // 아이템 드롭률
  mesoAcquisition?: number | null; // 메소 획득량
  buffDuration?: number | null; // 버프 지속시간
  attackSpeed?: number | null; // 공격 속도
  normalMonsterDamage?: number | null; // 일반 몬스터 데미지
  cooldownReductionPercent?: number | null; // 재사용 대기시간 감소 (%)
  cooldownReductionSeconds?: number | null; // 재사용 대기시간 감소 (초)
  cooldownExemption?: number | null; // 재사용 대기시간 미적용
  ignoreAttributeResistance?: number | null; // 속성 내성 무시
  abnormalStatusAdditionalDamage?: number | null; // 상태이상 추가 데미지
  weaponMastery?: number | null; // 무기 숙련도
  additionalExp?: number | null; // 추가 경험치 획득
  attackPower?: number | null; // 공격력
  magicPower?: number | null; // 마력
  combatPower?: number | null; // 전투력
  summonDurationIncrease?: number | null; // 소환수 지속시간 증가
  remainAp?: number | null; // 남은 AP 포인트
}
