-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('low', 'medium', 'high');

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "priority" "Priority" NOT NULL DEFAULT 'low';
