-- AlterTable
ALTER TABLE `document` ADD COLUMN     `projectId` INT NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE `document` ADD FOREIGN KEY (`projectId`) REFERENCES `project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
