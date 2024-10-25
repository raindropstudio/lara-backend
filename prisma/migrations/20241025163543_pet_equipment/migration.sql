-- CreateTable
CREATE TABLE `PetEquipment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `characterId` INTEGER NOT NULL,
    `petName` VARCHAR(191) NOT NULL,
    `petNickname` VARCHAR(191) NOT NULL,
    `petIcon` VARCHAR(191) NOT NULL,
    `petDescription` VARCHAR(191) NOT NULL,
    `itemName` VARCHAR(191) NULL,
    `itemIcon` VARCHAR(191) NULL,
    `itemDescription` VARCHAR(191) NULL,
    `attackPower` INTEGER NULL,
    `magicPower` INTEGER NULL,
    `scrollUpgrade` INTEGER NULL,
    `scrollUpgradable` INTEGER NULL,
    `itemShape` VARCHAR(191) NULL,
    `itemShapeIcon` VARCHAR(191) NULL,
    `autoSkill1` VARCHAR(191) NULL,
    `autoSkill1Icon` VARCHAR(191) NULL,
    `autoSkill2` VARCHAR(191) NULL,
    `autoSkill2Icon` VARCHAR(191) NULL,
    `petSkills` JSON NULL,
    `petType` VARCHAR(191) NULL,
    `petDateExpire` DATETIME(3) NULL,
    `petAppearance` VARCHAR(191) NULL,
    `petAppearanceIcon` VARCHAR(191) NULL,
    `petNo` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PetEquipment` ADD CONSTRAINT `PetEquipment_characterId_fkey` FOREIGN KEY (`characterId`) REFERENCES `Character`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
