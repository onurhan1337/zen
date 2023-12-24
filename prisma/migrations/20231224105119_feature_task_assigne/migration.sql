/*
  Warnings:

  - You are about to drop the `_TaskMembers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_TaskMembers" DROP CONSTRAINT "_TaskMembers_A_fkey";

-- DropForeignKey
ALTER TABLE "_TaskMembers" DROP CONSTRAINT "_TaskMembers_B_fkey";

-- DropIndex
DROP INDEX "Task_projectId_ownerId_idx";

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "assigneeId" TEXT;

-- DropTable
DROP TABLE "_TaskMembers";

-- CreateIndex
CREATE INDEX "Task_projectId_ownerId_assigneeId_idx" ON "Task"("projectId", "ownerId", "assigneeId");

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
