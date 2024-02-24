/*
  Warnings:

  - A unique constraint covering the columns `[inviteCode]` on the table `Project` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('owner', 'member');

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_userId_fkey";

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "inviteCode" TEXT;

-- CreateTable
CREATE TABLE "ProjectInviteAttempt" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "expires" TIMESTAMP(3),
    "role" "Role" NOT NULL DEFAULT 'member',

    CONSTRAINT "ProjectInviteAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_projectOwners" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ProjectInviteAttempt_id_key" ON "ProjectInviteAttempt"("id");

-- CreateIndex
CREATE INDEX "ProjectInviteAttempt_userId_projectId_idx" ON "ProjectInviteAttempt"("userId", "projectId");

-- CreateIndex
CREATE UNIQUE INDEX "_projectOwners_AB_unique" ON "_projectOwners"("A", "B");

-- CreateIndex
CREATE INDEX "_projectOwners_B_index" ON "_projectOwners"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Project_inviteCode_key" ON "Project"("inviteCode");

-- AddForeignKey
ALTER TABLE "ProjectInviteAttempt" ADD CONSTRAINT "ProjectInviteAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectInviteAttempt" ADD CONSTRAINT "ProjectInviteAttempt_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_projectOwners" ADD CONSTRAINT "_projectOwners_A_fkey" FOREIGN KEY ("A") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_projectOwners" ADD CONSTRAINT "_projectOwners_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
