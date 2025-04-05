/*

*/
-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "followupSchedule" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "jobId" INTEGER,
ADD COLUMN     "tests" TEXT NOT NULL DEFAULT '';
