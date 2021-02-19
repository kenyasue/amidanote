-- AlterTable
ALTER TABLE `document` ADD COLUMN     `userId` INT NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE `document` ADD FOREIGN KEY (`userId`) REFERENCES `accounts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
