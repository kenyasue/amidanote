-- DropForeignKey
ALTER TABLE `document` DROP FOREIGN KEY `document_ibfk_1`;

-- AddForeignKey
ALTER TABLE `document` ADD FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
