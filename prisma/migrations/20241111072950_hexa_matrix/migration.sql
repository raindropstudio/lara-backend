-- CreateTable
CREATE TABLE `HexaCore` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `characterClass` VARCHAR(191) NOT NULL,
    `coreName` VARCHAR(191) NOT NULL,
    `coreType` ENUM('마스터리 코어', '스킬 코어', '강화 코어', '공용 코어') NOT NULL,
    `description` TEXT NULL,
    `descriptionHash` VARCHAR(191) NULL,

    UNIQUE INDEX `HexaCore_characterClass_coreName_key`(`characterClass`, `coreName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HexaCoreSkill` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `hexaCoreId` INTEGER NOT NULL,
    `skillName` VARCHAR(191) NOT NULL,
    `skillIcon` VARCHAR(191) NULL,
    `iconHash` VARCHAR(191) NULL,

    UNIQUE INDEX `HexaCoreSkill_hexaCoreId_skillName_key`(`hexaCoreId`, `skillName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HexaCoreSkillEffect` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `hexaCoreSkillId` INTEGER NOT NULL,
    `level` INTEGER NOT NULL,
    `effect` TEXT NOT NULL,
    `hash` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `HexaCoreSkillEffect_hexaCoreSkillId_level_key`(`hexaCoreSkillId`, `level`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CharacterHexaCore` (
    `characterId` INTEGER NOT NULL,
    `hexaCoreId` INTEGER NOT NULL,
    `coreLevel` INTEGER NOT NULL,

    PRIMARY KEY (`characterId`, `hexaCoreId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `HexaCoreSkill` ADD CONSTRAINT `HexaCoreSkill_hexaCoreId_fkey` FOREIGN KEY (`hexaCoreId`) REFERENCES `HexaCore`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HexaCoreSkillEffect` ADD CONSTRAINT `HexaCoreSkillEffect_hexaCoreSkillId_fkey` FOREIGN KEY (`hexaCoreSkillId`) REFERENCES `HexaCoreSkill`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CharacterHexaCore` ADD CONSTRAINT `CharacterHexaCore_characterId_fkey` FOREIGN KEY (`characterId`) REFERENCES `Character`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CharacterHexaCore` ADD CONSTRAINT `CharacterHexaCore_hexaCoreId_fkey` FOREIGN KEY (`hexaCoreId`) REFERENCES `HexaCore`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
