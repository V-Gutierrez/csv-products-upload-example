/*
  Warnings:

  - You are about to drop the `ProccessingLogs` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "ProccessingLogs";

-- CreateTable
CREATE TABLE "ProcessingLogs" (
    "id" TEXT NOT NULL,
    "ready" BOOLEAN NOT NULL DEFAULT false,
    "failure" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "ProcessingLogs_id_key" ON "ProcessingLogs"("id");
