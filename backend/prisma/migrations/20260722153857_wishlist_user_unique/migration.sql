-- Add unique constraint: one wishlist per user
CREATE UNIQUE INDEX "wishlists_userId_key" ON "wishlists"("userId");
