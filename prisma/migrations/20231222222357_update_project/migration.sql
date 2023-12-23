-- AlterTable
ALTER TABLE "Task" ALTER COLUMN "ownerId" DROP DEFAULT;

-- CreateTable
CREATE TABLE "_projectMembers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_projectMembers_AB_unique" ON "_projectMembers"("A", "B");

-- CreateIndex
CREATE INDEX "_projectMembers_B_index" ON "_projectMembers"("B");

-- AddForeignKey
ALTER TABLE "_projectMembers" ADD CONSTRAINT "_projectMembers_A_fkey" FOREIGN KEY ("A") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_projectMembers" ADD CONSTRAINT "_projectMembers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
