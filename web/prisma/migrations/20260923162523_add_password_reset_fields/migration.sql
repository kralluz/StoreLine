-- AlterTable
ALTER TABLE "users" ADD COLUMN "resetCode" TEXT;
ALTER TABLE "users" ADD COLUMN "resetCodeExpiry" TIMESTAMP(3);
ALTER TABLE "users" ADD COLUMN "resetAttempts" INTEGER NOT NULL DEFAULT 0;
