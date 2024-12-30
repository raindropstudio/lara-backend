-- CreateTable
CREATE TABLE `CharacterSkill` (
    `characterId` INTEGER NOT NULL,
    `skillId` INTEGER NOT NULL,

    PRIMARY KEY (`characterId`, `skillId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CharacterLinkSkill` (
    `characterId` INTEGER NOT NULL,
    `skillId` INTEGER NOT NULL,
    `presetNo` INTEGER NOT NULL,
    `ownedSkill` BOOLEAN NOT NULL,

    PRIMARY KEY (`characterId`, `presetNo`, `skillId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Skill` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `hash` VARCHAR(191) NOT NULL,
    `grade` VARCHAR(191) NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(500) NULL,
    `level` INTEGER NOT NULL,
    `icon` VARCHAR(191) NOT NULL,
    `effect` VARCHAR(500) NULL,
    `effectNext` VARCHAR(500) NULL,

    UNIQUE INDEX `Skill_hash_key`(`hash`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CharacterSkillCore` (
    `characterId` INTEGER NOT NULL,
    `skillCoreId` INTEGER NOT NULL,
    `slotId` INTEGER NULL,
    `slotLevel` INTEGER NULL,
    `coreLevel` INTEGER NOT NULL,

    PRIMARY KEY (`characterId`, `skillCoreId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SkillCore` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `hash` VARCHAR(191) NOT NULL,
    `grade` INTEGER NOT NULL,
    `coreName` VARCHAR(191) NOT NULL,
    `coreType` VARCHAR(191) NOT NULL,
    `coreSkill` JSON NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CharacterSkill` ADD CONSTRAINT `CharacterSkill_characterId_fkey` FOREIGN KEY (`characterId`) REFERENCES `Character`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CharacterSkill` ADD CONSTRAINT `CharacterSkill_skillId_fkey` FOREIGN KEY (`skillId`) REFERENCES `Skill`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CharacterLinkSkill` ADD CONSTRAINT `CharacterLinkSkill_characterId_fkey` FOREIGN KEY (`characterId`) REFERENCES `Character`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CharacterLinkSkill` ADD CONSTRAINT `CharacterLinkSkill_skillId_fkey` FOREIGN KEY (`skillId`) REFERENCES `Skill`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CharacterSkillCore` ADD CONSTRAINT `CharacterSkillCore_characterId_fkey` FOREIGN KEY (`characterId`) REFERENCES `Character`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CharacterSkillCore` ADD CONSTRAINT `CharacterSkillCore_skillCoreId_fkey` FOREIGN KEY (`skillCoreId`) REFERENCES `SkillCore`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
