-- 임시로 외래키 체크를 비활성화
SET FOREIGN_KEY_CHECKS=0;

-- CharacterSkillCore 테이블의 참조를 가장 오래된 SkillCore ID로 업데이트
UPDATE CharacterSkillCore csc
INNER JOIN (
    SELECT MIN(id) as keep_id, hash
    FROM SkillCore
    GROUP BY hash
) s2
INNER JOIN SkillCore s3 ON s3.hash = s2.hash
SET csc.skillCoreId = s2.keep_id
WHERE csc.skillCoreId = s3.id;

-- 중복 레코드 삭제
DELETE s1 FROM SkillCore s1
INNER JOIN SkillCore s2
WHERE s1.hash = s2.hash AND s1.id > s2.id;

-- unique 인덱스 생성
CREATE UNIQUE INDEX `SkillCore_hash_key` ON `SkillCore`(`hash`);

-- 외래키 체크 다시 활성화
SET FOREIGN_KEY_CHECKS=1;
