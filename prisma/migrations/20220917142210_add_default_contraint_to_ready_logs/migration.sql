-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ProccessingLogs" (
    "id" TEXT NOT NULL,
    "ready" BOOLEAN NOT NULL DEFAULT false,
    "productId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ProccessingLogs_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("lm") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ProccessingLogs" ("createdAt", "id", "productId", "ready") SELECT "createdAt", "id", "productId", "ready" FROM "ProccessingLogs";
DROP TABLE "ProccessingLogs";
ALTER TABLE "new_ProccessingLogs" RENAME TO "ProccessingLogs";
CREATE UNIQUE INDEX "ProccessingLogs_id_key" ON "ProccessingLogs"("id");
CREATE UNIQUE INDEX "ProccessingLogs_productId_key" ON "ProccessingLogs"("productId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
