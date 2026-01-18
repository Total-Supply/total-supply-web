-- AlterTable
ALTER TABLE "ServiceAssignment" ADD COLUMN     "completionNotes" TEXT,
ADD COLUMN     "followUpRecommendations" TEXT,
ADD COLUMN     "solutionSummary" TEXT,
ADD COLUMN     "timeSpentMinutes" INTEGER DEFAULT 0;
