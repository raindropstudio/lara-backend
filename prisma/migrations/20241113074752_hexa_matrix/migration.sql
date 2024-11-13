/*
  Warnings:

  - The values [마스터리 코어,스킬 코어,강화 코어,공용 코어] on the enum `HexaCore_coreType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `iconHash` on the `HexaCoreSkill` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `HexaCore` MODIFY `coreType` ENUM('MASTERY_CORE', 'SKILL_CORE', 'ENHANCEMENT_CORE', 'COMMON_CORE') NOT NULL;

-- AlterTable
ALTER TABLE `HexaCoreSkill` DROP COLUMN `iconHash`;
