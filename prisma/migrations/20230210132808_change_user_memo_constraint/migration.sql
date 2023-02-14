/*
  Warnings:

  - Made the column `userId` on table `memo` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `memo` DROP FOREIGN KEY `Memo_userId_fkey`;

-- AlterTable
ALTER TABLE `memo` MODIFY `userId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Memo` ADD CONSTRAINT `Memo_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
