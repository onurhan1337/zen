-- DropIndex
DROP INDEX "Task_projectId_idx";

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "ownerId" TEXT NOT NULL DEFAULT 'defaultOwnerId';

-- CreateTable
CREATE TABLE "_TaskMembers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_TaskMembers_AB_unique" ON "_TaskMembers"("A", "B");

-- CreateIndex
CREATE INDEX "_TaskMembers_B_index" ON "_TaskMembers"("B");

-- CreateIndex
CREATE INDEX "Task_projectId_ownerId_idx" ON "Task"("projectId", "ownerId");

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TaskMembers" ADD CONSTRAINT "_TaskMembers_A_fkey" FOREIGN KEY ("A") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TaskMembers" ADD CONSTRAINT "_TaskMembers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
