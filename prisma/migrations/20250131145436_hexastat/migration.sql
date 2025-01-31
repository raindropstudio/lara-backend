-- CreateTable
CREATE TABLE `HexaStat` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `hash` VARCHAR(191) NOT NULL,
    `mainStatName` VARCHAR(191) NOT NULL,
    `mainStatLevel` INTEGER NOT NULL,
    `subStat1Name` VARCHAR(191) NOT NULL,
    `subStat1Level` INTEGER NOT NULL,
    `subStat2Name` VARCHAR(191) NOT NULL,
    `subStat2Level` INTEGER NOT NULL,
    `statGrade` INTEGER NOT NULL,

    UNIQUE INDEX `HexaStat_hash_key`(`hash`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CharacterHexaStat` (
    `characterId` INTEGER NOT NULL,
    `hexaStatId` INTEGER NOT NULL,
    `hexaStatNo` INTEGER NOT NULL,
    `presetNo` INTEGER NOT NULL,
    `active` BOOLEAN NOT NULL,

    PRIMARY KEY (`characterId`, `hexaStatId`, `presetNo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CharacterHexaStat` ADD CONSTRAINT `CharacterHexaStat_characterId_fkey` FOREIGN KEY (`characterId`) REFERENCES `Character`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CharacterHexaStat` ADD CONSTRAINT `CharacterHexaStat_hexaStatId_fkey` FOREIGN KEY (`hexaStatId`) REFERENCES `HexaStat`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
