-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "lm" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "free_shipping" BOOLEAN NOT NULL,
    "description" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "category" TEXT NOT NULL
);
INSERT INTO "new_Product" ("category", "description", "free_shipping", "lm", "name", "price") SELECT "category", "description", "free_shipping", "lm", "name", "price" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE UNIQUE INDEX "Product_lm_key" ON "Product"("lm");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
