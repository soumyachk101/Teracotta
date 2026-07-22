-- Denormalized review aggregates on products
ALTER TABLE "products" ADD COLUMN "rating" DOUBLE PRECISION NOT NULL DEFAULT 0;
ALTER TABLE "products" ADD COLUMN "reviewCount" INTEGER NOT NULL DEFAULT 0;
