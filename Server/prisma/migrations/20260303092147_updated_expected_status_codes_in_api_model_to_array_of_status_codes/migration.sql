/*
  Warnings:

  - The `expectedStatusCodes` column on the `Api` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Api" DROP COLUMN "expectedStatusCodes",
ADD COLUMN     "expectedStatusCodes" INTEGER[] DEFAULT ARRAY[200]::INTEGER[];
