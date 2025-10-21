/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `Membership` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Membership" ALTER COLUMN "is_active" SET DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "Membership_user_id_key" ON "Membership"("user_id");
