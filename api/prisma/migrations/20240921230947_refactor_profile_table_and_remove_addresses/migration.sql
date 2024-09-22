/*
  Warnings:

  - You are about to drop the `Addresses` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Addresses" DROP CONSTRAINT "Addresses_user_id_fkey";

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "city" VARCHAR(120),
ADD COLUMN     "country" VARCHAR(120),
ADD COLUMN     "state" VARCHAR(120);

-- DropTable
DROP TABLE "Addresses";
