-- CreateTable
CREATE TABLE `Character` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ocid` VARCHAR(191) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `nickname` VARCHAR(191) NOT NULL,
    `worldName` VARCHAR(191) NULL,
    `gender` VARCHAR(191) NULL,
    `class` VARCHAR(191) NULL,
    `classLevel` VARCHAR(191) NULL,
    `level` INTEGER NULL,
    `exp` BIGINT NULL,
    `expRate` DOUBLE NULL,
    `guildName` VARCHAR(191) NULL,
    `imageUrl` VARCHAR(299) NULL,
    `dateCreate` DATETIME(3) NULL,
    `accessFlag` BOOLEAN NULL,
    `liberationQuestClear` BOOLEAN NULL,
    `popularity` INTEGER NULL,
    `statId` INTEGER NULL,
    `propensityId` INTEGER NULL,
    `unionId` INTEGER NULL,

    UNIQUE INDEX `Character_nickname_key`(`nickname`),
    UNIQUE INDEX `Character_statId_key`(`statId`),
    UNIQUE INDEX `Character_propensityId_key`(`propensityId`),
    UNIQUE INDEX `Character_unionId_key`(`unionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Stat` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `maxStatAttackPower` INTEGER NULL,
    `minStatAttackPower` INTEGER NULL,
    `damage` DOUBLE NULL,
    `bossMonsterDamage` DOUBLE NULL,
    `finalDamage` DOUBLE NULL,
    `ignoreDefenseRate` DOUBLE NULL,
    `criticalRate` INTEGER NULL,
    `criticalDamage` DOUBLE NULL,
    `abnormalStatusResistance` INTEGER NULL,
    `stance` INTEGER NULL,
    `defense` INTEGER NULL,
    `moveSpeed` INTEGER NULL,
    `jumpPower` INTEGER NULL,
    `starForce` INTEGER NULL,
    `arcaneForce` INTEGER NULL,
    `authenticForce` INTEGER NULL,
    `str` INTEGER NULL,
    `dex` INTEGER NULL,
    `int` INTEGER NULL,
    `luk` INTEGER NULL,
    `hp` INTEGER NULL,
    `mp` INTEGER NULL,
    `apStr` INTEGER NULL,
    `apDex` INTEGER NULL,
    `apInt` INTEGER NULL,
    `apLuk` INTEGER NULL,
    `apHp` INTEGER NULL,
    `apMp` INTEGER NULL,
    `itemDropRate` INTEGER NULL,
    `mesoAcquisition` INTEGER NULL,
    `buffDuration` INTEGER NULL,
    `attackSpeed` INTEGER NULL,
    `normalMonsterDamage` DOUBLE NULL,
    `cooldownReductionPercent` INTEGER NULL,
    `cooldownReductionSeconds` INTEGER NULL,
    `cooldownExemption` INTEGER NULL,
    `ignoreAttributeResistance` DOUBLE NULL,
    `abnormalStatusAdditionalDamage` DOUBLE NULL,
    `weaponMastery` INTEGER NULL,
    `additionalExp` DOUBLE NULL,
    `attackPower` INTEGER NULL,
    `magicPower` INTEGER NULL,
    `combatPower` INTEGER NULL,
    `summonDurationIncrease` INTEGER NULL,
    `remainAp` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CharacterHyperStat` (
    `characterId` INTEGER NOT NULL,
    `hyperStatId` INTEGER NOT NULL,
    `presetNo` INTEGER NOT NULL,
    `active` BOOLEAN NOT NULL,

    PRIMARY KEY (`characterId`, `presetNo`, `hyperStatId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HyperStat` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `statType` VARCHAR(191) NOT NULL,
    `statLevel` INTEGER NULL,
    `statPoint` INTEGER NOT NULL,
    `statIncrease` VARCHAR(191) NULL,

    UNIQUE INDEX `HyperStat_statType_statPoint_key`(`statType`, `statPoint`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Propensity` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `charismaLevel` INTEGER NOT NULL,
    `sensibilityLevel` INTEGER NOT NULL,
    `insightLevel` INTEGER NOT NULL,
    `willingnessLevel` INTEGER NOT NULL,
    `handicraftLevel` INTEGER NOT NULL,
    `charmLevel` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CharacterAbility` (
    `characterId` INTEGER NOT NULL,
    `abilityId` INTEGER NULL,
    `abilityNo` INTEGER NOT NULL,
    `presetNo` INTEGER NOT NULL,
    `active` BOOLEAN NOT NULL,

    PRIMARY KEY (`characterId`, `presetNo`, `abilityNo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Ability` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `abilityGrade` ENUM('RARE', 'EPIC', 'UNIQUE', 'LEGENDARY') NOT NULL,
    `abilityValue` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Ability_abilityValue_key`(`abilityValue`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CharacterItemEquipment` (
    `characterId` INTEGER NOT NULL,
    `itemEquipmentId` INTEGER NOT NULL,
    `presetNo` INTEGER NOT NULL,
    `active` BOOLEAN NOT NULL,

    PRIMARY KEY (`characterId`, `presetNo`, `itemEquipmentId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ItemEquipment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `hash` VARCHAR(191) NOT NULL,
    `part` VARCHAR(191) NOT NULL,
    `slot` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `icon` VARCHAR(191) NOT NULL,
    `description` VARCHAR(500) NULL,
    `shapeName` VARCHAR(191) NULL,
    `shapeIcon` VARCHAR(191) NULL,
    `gender` VARCHAR(191) NULL,
    `potentialOptionGrade` ENUM('RARE', 'EPIC', 'UNIQUE', 'LEGENDARY') NULL,
    `additionalPotentialOptionGrade` ENUM('RARE', 'EPIC', 'UNIQUE', 'LEGENDARY') NULL,
    `equipmentLevelIncrease` INTEGER NULL,
    `growthExp` INTEGER NULL,
    `growthLevel` INTEGER NULL,
    `scrollUpgrade` INTEGER NULL,
    `cuttableCount` INTEGER NULL,
    `goldenHammerFlag` BOOLEAN NULL,
    `scrollResilienceCount` INTEGER NULL,
    `scrollUpgradeableCount` INTEGER NULL,
    `soulName` VARCHAR(191) NULL,
    `soulOption` VARCHAR(191) NULL,
    `starforce` INTEGER NULL,
    `starforceScrollFlag` BOOLEAN NULL,
    `specialRingLevel` INTEGER NULL,
    `dateExpire` DATETIME(3) NULL,
    `dateOptionExpire` DATETIME(3) NULL,

    UNIQUE INDEX `ItemEquipment_hash_key`(`hash`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ItemEquipmentPotential` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `equipmentId` INTEGER NOT NULL,
    `potentialId` INTEGER NOT NULL,
    `potentialNo` INTEGER NOT NULL,

    UNIQUE INDEX `ItemEquipmentPotential_equipmentId_potentialId_potentialNo_key`(`equipmentId`, `potentialId`, `potentialNo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Potential` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `potential` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Potential_potential_key`(`potential`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ItemEquipmentOption` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `itemEquipmentId` INTEGER NOT NULL,
    `optionId` INTEGER NOT NULL,
    `optionType` ENUM('TOTAL', 'BASE', 'EXCEPTIONAL', 'ADD', 'ETC', 'STARFORCE') NOT NULL,

    UNIQUE INDEX `ItemEquipmentOption_itemEquipmentId_optionType_optionId_key`(`itemEquipmentId`, `optionType`, `optionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ItemOption` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `hash` VARCHAR(191) NOT NULL,
    `str` INTEGER NULL,
    `dex` INTEGER NULL,
    `int` INTEGER NULL,
    `luk` INTEGER NULL,
    `maxHp` INTEGER NULL,
    `maxMp` INTEGER NULL,
    `attackPower` INTEGER NULL,
    `magicPower` INTEGER NULL,
    `armor` INTEGER NULL,
    `speed` INTEGER NULL,
    `jump` INTEGER NULL,
    `bossDamage` INTEGER NULL,
    `ignoreMonsterArmor` INTEGER NULL,
    `allStat` INTEGER NULL,
    `damage` INTEGER NULL,
    `equipmentLevelDecrease` INTEGER NULL,
    `maxHpRate` INTEGER NULL,
    `maxMpRate` INTEGER NULL,
    `baseEquipmentLevel` INTEGER NULL,
    `exceptionalUpgrade` INTEGER NULL,

    UNIQUE INDEX `ItemOption_hash_key`(`hash`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CharacterCashEquipment` (
    `characterId` INTEGER NOT NULL,
    `cashEquipmentId` INTEGER NOT NULL,
    `optionId` INTEGER NULL,
    `dateExpire` DATETIME(3) NULL,
    `dateOptionExpire` DATETIME(3) NULL,
    `coloringPrismRange` ENUM('ALL', 'RED', 'YELLOW', 'GREEN', 'CYAN', 'BLUE', 'PURPLE') NULL,
    `coloringPrismHue` INTEGER NULL,
    `coloringPrismSaturation` INTEGER NULL,
    `coloringPrismValue` INTEGER NULL,
    `presetNo` INTEGER NOT NULL,
    `active` BOOLEAN NOT NULL,

    PRIMARY KEY (`characterId`, `presetNo`, `cashEquipmentId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CashEquipment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `part` VARCHAR(191) NOT NULL,
    `slot` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `icon` VARCHAR(191) NOT NULL,
    `description` VARCHAR(500) NULL,
    `label` VARCHAR(191) NULL,
    `itemGender` VARCHAR(191) NULL,

    UNIQUE INDEX `CashEquipment_icon_key`(`icon`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Symbol` (
    `characterId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `force` INTEGER NOT NULL,
    `level` INTEGER NOT NULL,
    `str` INTEGER NOT NULL,
    `dex` INTEGER NOT NULL,
    `int` INTEGER NOT NULL,
    `luk` INTEGER NOT NULL,
    `hp` INTEGER NOT NULL,
    `dropRate` INTEGER NOT NULL,
    `mesoRate` INTEGER NOT NULL,
    `expRate` INTEGER NOT NULL,
    `growthCount` INTEGER NOT NULL,
    `requireGrowthCount` INTEGER NOT NULL,

    PRIMARY KEY (`characterId`, `name`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CharacterSetEffect` (
    `characterId` INTEGER NOT NULL,
    `setEffectId` INTEGER NOT NULL,
    `setCount` INTEGER NOT NULL,

    PRIMARY KEY (`characterId`, `setEffectId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SetEffect` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `setName` VARCHAR(191) NOT NULL,
    `hash` VARCHAR(191) NOT NULL,
    `setOptionList` JSON NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Union` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `unionLevel` INTEGER NOT NULL,
    `unionArtifactLevel` INTEGER NOT NULL,
    `unionArtifactExp` INTEGER NOT NULL,
    `unionArtifactPoint` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Character` ADD CONSTRAINT `Character_statId_fkey` FOREIGN KEY (`statId`) REFERENCES `Stat`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Character` ADD CONSTRAINT `Character_propensityId_fkey` FOREIGN KEY (`propensityId`) REFERENCES `Propensity`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Character` ADD CONSTRAINT `Character_unionId_fkey` FOREIGN KEY (`unionId`) REFERENCES `Union`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CharacterHyperStat` ADD CONSTRAINT `CharacterHyperStat_characterId_fkey` FOREIGN KEY (`characterId`) REFERENCES `Character`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CharacterHyperStat` ADD CONSTRAINT `CharacterHyperStat_hyperStatId_fkey` FOREIGN KEY (`hyperStatId`) REFERENCES `HyperStat`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CharacterAbility` ADD CONSTRAINT `CharacterAbility_characterId_fkey` FOREIGN KEY (`characterId`) REFERENCES `Character`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CharacterAbility` ADD CONSTRAINT `CharacterAbility_abilityId_fkey` FOREIGN KEY (`abilityId`) REFERENCES `Ability`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CharacterItemEquipment` ADD CONSTRAINT `CharacterItemEquipment_characterId_fkey` FOREIGN KEY (`characterId`) REFERENCES `Character`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CharacterItemEquipment` ADD CONSTRAINT `CharacterItemEquipment_itemEquipmentId_fkey` FOREIGN KEY (`itemEquipmentId`) REFERENCES `ItemEquipment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ItemEquipmentPotential` ADD CONSTRAINT `ItemEquipmentPotential_equipmentId_fkey` FOREIGN KEY (`equipmentId`) REFERENCES `ItemEquipment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ItemEquipmentPotential` ADD CONSTRAINT `ItemEquipmentPotential_potentialId_fkey` FOREIGN KEY (`potentialId`) REFERENCES `Potential`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ItemEquipmentOption` ADD CONSTRAINT `ItemEquipmentOption_itemEquipmentId_fkey` FOREIGN KEY (`itemEquipmentId`) REFERENCES `ItemEquipment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ItemEquipmentOption` ADD CONSTRAINT `ItemEquipmentOption_optionId_fkey` FOREIGN KEY (`optionId`) REFERENCES `ItemOption`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CharacterCashEquipment` ADD CONSTRAINT `CharacterCashEquipment_characterId_fkey` FOREIGN KEY (`characterId`) REFERENCES `Character`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CharacterCashEquipment` ADD CONSTRAINT `CharacterCashEquipment_cashEquipmentId_fkey` FOREIGN KEY (`cashEquipmentId`) REFERENCES `CashEquipment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CharacterCashEquipment` ADD CONSTRAINT `CharacterCashEquipment_optionId_fkey` FOREIGN KEY (`optionId`) REFERENCES `ItemOption`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Symbol` ADD CONSTRAINT `Symbol_characterId_fkey` FOREIGN KEY (`characterId`) REFERENCES `Character`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CharacterSetEffect` ADD CONSTRAINT `CharacterSetEffect_characterId_fkey` FOREIGN KEY (`characterId`) REFERENCES `Character`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CharacterSetEffect` ADD CONSTRAINT `CharacterSetEffect_setEffectId_fkey` FOREIGN KEY (`setEffectId`) REFERENCES `SetEffect`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
