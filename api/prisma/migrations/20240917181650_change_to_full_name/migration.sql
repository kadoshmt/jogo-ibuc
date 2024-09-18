/*
  Warnings:

  - You are about to drop the column `firstName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `User` table. All the data in the column will be lost.
  - You are about to alter the column `email` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(120)`.
  - You are about to alter the column `password` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `googleId` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(30)`.
  - You are about to alter the column `microsoftId` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(30)`.
  - You are about to alter the column `avatar` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `facebookId` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(30)`.
  - You are about to alter the column `username` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(40)`.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "firstName",
DROP COLUMN "lastName",
ADD COLUMN     "name" VARCHAR(255),
ALTER COLUMN "email" SET DATA TYPE VARCHAR(120),
ALTER COLUMN "password" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "googleId" SET DATA TYPE VARCHAR(30),
ALTER COLUMN "microsoftId" SET DATA TYPE VARCHAR(30),
ALTER COLUMN "avatar" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "facebookId" SET DATA TYPE VARCHAR(30),
ALTER COLUMN "username" SET DATA TYPE VARCHAR(40);
