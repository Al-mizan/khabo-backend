-- AlterTable
ALTER TABLE "meals" ADD COLUMN     "rating_count" INTEGER DEFAULT 0,
ADD COLUMN     "rating_sum" INTEGER DEFAULT 0;
