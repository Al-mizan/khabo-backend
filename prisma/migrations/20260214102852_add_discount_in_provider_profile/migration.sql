-- AlterTable
ALTER TABLE "provider_profiles" ADD COLUMN     "discount_percent" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "discount_thereshold" DOUBLE PRECISION NOT NULL DEFAULT 0;
