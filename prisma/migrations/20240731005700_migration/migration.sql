/*
  Warnings:

  - You are about to drop the column `nickname` on the `User` table. All the data in the column will be lost.
  - Added the required column `phone` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `User` DROP COLUMN `nickname`,
    ADD COLUMN `email` VARCHAR(100) NULL,
    ADD COLUMN `name` VARCHAR(100) NULL,
    ADD COLUMN `phone` INTEGER NOT NULL;
