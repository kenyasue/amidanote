/*
  Warnings:

  - Added the required column `collaborators` to the `project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `project` ADD COLUMN     `collaborators` VARCHAR(191) NOT NULL;
