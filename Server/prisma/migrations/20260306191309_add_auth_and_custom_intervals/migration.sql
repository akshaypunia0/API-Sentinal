-- CreateEnum
CREATE TYPE "AuthType" AS ENUM ('NONE', 'BEARER_TOKEN', 'API_KEY', 'BASIC_AUTH', 'CUSTOM_HEADER');

-- AlterTable
ALTER TABLE "Api" ADD COLUMN     "authHeaderName" TEXT,
ADD COLUMN     "authHeaderValue" TEXT,
ADD COLUMN     "authToken" TEXT,
ADD COLUMN     "authType" "AuthType" NOT NULL DEFAULT 'NONE',
ADD COLUMN     "password" TEXT,
ADD COLUMN     "username" TEXT;
