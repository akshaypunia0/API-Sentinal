/*
  Warnings:

  - You are about to drop the column `description` on the `Api` table. All the data in the column will be lost.
  - You are about to drop the column `endpoint` on the `Api` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[url]` on the table `Api` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `url` to the `Api` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `method` on the `Api` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "HttpMethod" AS ENUM ('GET', 'POST', 'PUT', 'DELETE', 'PATCH');

-- CreateEnum
CREATE TYPE "ApiStatus" AS ENUM ('UP', 'DOWN');

-- DropForeignKey
ALTER TABLE "Api" DROP CONSTRAINT "Api_userId_fkey";

-- DropIndex
DROP INDEX "Api_endpoint_key";

-- AlterTable
ALTER TABLE "Api" DROP COLUMN "description",
DROP COLUMN "endpoint",
ADD COLUMN     "intervalMinutes" INTEGER NOT NULL DEFAULT 5,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "url" TEXT NOT NULL,
DROP COLUMN "method",
ADD COLUMN     "method" "HttpMethod" NOT NULL;

-- CreateTable
CREATE TABLE "ApiCheckLog" (
    "id" TEXT NOT NULL,
    "apiId" TEXT NOT NULL,
    "status" "ApiStatus" NOT NULL,
    "statusCode" INTEGER NOT NULL,
    "responseTimeMs" INTEGER NOT NULL,
    "checkedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApiCheckLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Api_url_key" ON "Api"("url");

-- AddForeignKey
ALTER TABLE "Api" ADD CONSTRAINT "Api_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApiCheckLog" ADD CONSTRAINT "ApiCheckLog_apiId_fkey" FOREIGN KEY ("apiId") REFERENCES "Api"("id") ON DELETE CASCADE ON UPDATE CASCADE;
