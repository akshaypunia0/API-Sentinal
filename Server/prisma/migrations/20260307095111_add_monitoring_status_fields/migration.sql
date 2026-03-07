-- AlterTable
ALTER TABLE "Api" ADD COLUMN     "currentStatus" "ApiStatus" DEFAULT 'UP',
ADD COLUMN     "failureCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "lastCheckedAt" TIMESTAMP(3),
ADD COLUMN     "lastResponseTimeMs" INTEGER;
