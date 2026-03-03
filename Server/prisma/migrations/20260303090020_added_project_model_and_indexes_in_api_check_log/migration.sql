/*
  Warnings:

  - You are about to drop the column `name` on the `Api` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Api` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[projectId,url,method]` on the table `Api` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `projectId` to the `Api` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Api` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Api" DROP CONSTRAINT "Api_userId_fkey";

-- DropIndex
DROP INDEX "Api_url_key";

-- AlterTable
ALTER TABLE "Api" DROP COLUMN "name",
DROP COLUMN "userId",
ADD COLUMN     "projectId" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Api_projectId_url_method_key" ON "Api"("projectId", "url", "method");

-- CreateIndex
CREATE INDEX "ApiCheckLog_apiId_idx" ON "ApiCheckLog"("apiId");

-- CreateIndex
CREATE INDEX "ApiCheckLog_checkedAt_idx" ON "ApiCheckLog"("checkedAt");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Api" ADD CONSTRAINT "Api_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
