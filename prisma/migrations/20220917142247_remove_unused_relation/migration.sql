/*
  Warnings:

  - You are about to drop the column `productId` on the `ProccessingLogs` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ProccessingLogs" (
    "id" TEXT NOT NULL,
    "ready" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_ProccessingLogs" ("createdAt", "id", "ready") SELECT "createdAt", "id", "ready" FROM "ProccessingLogs";
DROP TABLE "ProccessingLogs";
ALTER TABLE "new_ProccessingLogs" RENAME TO "ProccessingLogs";
CREATE UNIQUE INDEX "ProccessingLogs_id_key" ON "ProccessingLogs"("id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
