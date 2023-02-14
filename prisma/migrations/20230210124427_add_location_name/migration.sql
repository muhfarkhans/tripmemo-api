/*
  Warnings:

  - Added the required column `locationName` to the `Memo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `memo` ADD COLUMN `locationName` VARCHAR(191) NOT NULL;
