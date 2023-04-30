-- CreateTable
CREATE TABLE `activities` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(45) NOT NULL,
    `category` ENUM('Aerobic', 'Strength', 'Aerobic & Strength', 'Flexibility') NULL,
    `description` VARCHAR(255) NULL,
    `intensityLevel` ENUM('Low', 'Medium', 'High', 'Very High', 'Varies with Type') NULL,
    `maxPeopleAllowed` INTEGER NULL,
    `requirementOne` VARCHAR(100) NULL,
    `requirementTwo` VARCHAR(100) NULL,
    `durationMinutes` INTEGER NOT NULL,
    `price` DECIMAL(10, 2) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `addresses` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `lineOne` VARCHAR(45) NOT NULL,
    `lineTwo` VARCHAR(45) NULL,
    `suburb` VARCHAR(45) NOT NULL,
    `postcode` VARCHAR(45) NOT NULL,
    `state` VARCHAR(45) NOT NULL,
    `country` VARCHAR(45) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `admins` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `loginId` INTEGER NULL,
    `firstName` VARCHAR(45) NOT NULL,
    `lastName` VARCHAR(45) NOT NULL,
    `phone` VARCHAR(45) NOT NULL,
    `addressId` INTEGER NULL,

    INDEX `fk_Managers_Addresses1_idx`(`addressId`),
    INDEX `fk_Managers_Logins1_idx`(`loginId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `blogs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(45) NOT NULL,
    `body` TEXT NOT NULL,
    `loginId` INTEGER NOT NULL,
    `createdAt` DATETIME(0) NULL,
    `updatedAt` DATETIME(0) NULL,

    INDEX `fk_Blogs_Logins1_idx`(`loginId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bookings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `memberId` INTEGER NOT NULL,
    `trainerId` INTEGER NOT NULL,
    `activityId` INTEGER NOT NULL,
    `dateTime` DATETIME(0) NOT NULL,

    INDEX `fk_Bookings_Activities1_idx`(`activityId`),
    INDEX `fk_Bookings_Trainers1_idx`(`trainerId`),
    INDEX `fk_member_activity_bookings_members1_idx`(`memberId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `logins` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(45) NOT NULL,
    `password` VARCHAR(100) NOT NULL,
    `username` VARCHAR(45) NOT NULL,
    `role` ENUM('Member', 'Trainer', 'Admin', '') NULL,
    `accessKey` VARCHAR(36) NULL,

    UNIQUE INDEX `email_UNIQUE`(`email`),
    UNIQUE INDEX `authKey_UNIQUE`(`accessKey`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `members` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `loginId` INTEGER NULL,
    `firstName` VARCHAR(45) NOT NULL,
    `lastName` VARCHAR(45) NOT NULL,
    `phone` VARCHAR(45) NOT NULL,
    `addressId` INTEGER NULL,
    `age` INTEGER NULL,
    `gender` ENUM('Female', 'Male', 'Other') NULL,

    INDEX `fk_Members_Addresses1_idx`(`addressId`),
    INDEX `fk_members_specific_traits_users1_idx`(`loginId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `trainers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `loginId` INTEGER NULL,
    `firstName` VARCHAR(45) NOT NULL,
    `lastName` VARCHAR(45) NOT NULL,
    `phone` VARCHAR(45) NOT NULL,
    `addressId` INTEGER NULL,
    `description` VARCHAR(255) NULL,
    `specialty` VARCHAR(45) NULL,
    `certificate` VARCHAR(45) NULL,
    `imageUrl` VARCHAR(255) NULL,

    INDEX `fk_Trainers_Addresses1_idx`(`addressId`),
    INDEX `fk_trainers_specific_traits_users1_idx`(`loginId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `admins` ADD CONSTRAINT `fk_Administrators_Addresses1` FOREIGN KEY (`addressId`) REFERENCES `addresses`(`id`) ON DELETE SET NULL ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE `admins` ADD CONSTRAINT `fk_Administrators_Logins1` FOREIGN KEY (`loginId`) REFERENCES `logins`(`id`) ON DELETE SET NULL ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE `blogs` ADD CONSTRAINT `fk_Blogs_Logins1` FOREIGN KEY (`loginId`) REFERENCES `logins`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `bookings` ADD CONSTRAINT `fk_Bookings_Activities1` FOREIGN KEY (`activityId`) REFERENCES `activities`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bookings` ADD CONSTRAINT `fk_Bookings_Members1` FOREIGN KEY (`memberId`) REFERENCES `members`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bookings` ADD CONSTRAINT `fk_Bookings_Trainers1` FOREIGN KEY (`trainerId`) REFERENCES `trainers`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `members` ADD CONSTRAINT `fk_Members_Addresses1` FOREIGN KEY (`addressId`) REFERENCES `addresses`(`id`) ON DELETE SET NULL ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE `members` ADD CONSTRAINT `fk_Members_Logins1` FOREIGN KEY (`loginId`) REFERENCES `logins`(`id`) ON DELETE SET NULL ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE `trainers` ADD CONSTRAINT `fk_Trainers_Addresses1` FOREIGN KEY (`addressId`) REFERENCES `addresses`(`id`) ON DELETE SET NULL ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE `trainers` ADD CONSTRAINT `fk_Trainers_Logins1` FOREIGN KEY (`loginId`) REFERENCES `logins`(`id`) ON DELETE SET NULL ON UPDATE SET NULL;

