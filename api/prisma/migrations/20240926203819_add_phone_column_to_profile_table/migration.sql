/*
  Warnings:

  - You are about to drop the column `whatsapp` on the `Profile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "whatsapp",
ADD COLUMN     "phone" VARCHAR(22);
