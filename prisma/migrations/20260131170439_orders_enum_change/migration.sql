/*
  Warnings:

  - The values [pending,confirmed,preparing,delivered,cancelled] on the enum `OrderStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [paid,unpaid,refunded] on the enum `PaymentStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "OrderStatus_new" AS ENUM ('PENDING', 'PREPARING', 'ON_THE_WAY', 'DELIVERED', 'CANCELLED');
ALTER TABLE "public"."orders" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "orders" ALTER COLUMN "status" TYPE "OrderStatus_new" USING ("status"::text::"OrderStatus_new");
ALTER TYPE "OrderStatus" RENAME TO "OrderStatus_old";
ALTER TYPE "OrderStatus_new" RENAME TO "OrderStatus";
DROP TYPE "public"."OrderStatus_old";
ALTER TABLE "orders" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "PaymentStatus_new" AS ENUM ('PAID', 'UNPAID', 'REFUNDED');
ALTER TABLE "public"."orders" ALTER COLUMN "payment_status" DROP DEFAULT;
ALTER TABLE "orders" ALTER COLUMN "payment_status" TYPE "PaymentStatus_new" USING ("payment_status"::text::"PaymentStatus_new");
ALTER TYPE "PaymentStatus" RENAME TO "PaymentStatus_old";
ALTER TYPE "PaymentStatus_new" RENAME TO "PaymentStatus";
DROP TYPE "public"."PaymentStatus_old";
ALTER TABLE "orders" ALTER COLUMN "payment_status" SET DEFAULT 'UNPAID';
COMMIT;

-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "status" SET DEFAULT 'PENDING',
ALTER COLUMN "payment_status" SET DEFAULT 'UNPAID';
