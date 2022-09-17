-- CreateTable
CREATE TABLE "Product" (
    "lm" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "free_shipping" BOOLEAN NOT NULL,
    "description" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "category" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "ProccessingLogs" (
    "id" TEXT NOT NULL,
    "ready" BOOLEAN NOT NULL,
    "productId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ProccessingLogs_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("lm") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_lm_key" ON "Product"("lm");

-- CreateIndex
CREATE UNIQUE INDEX "ProccessingLogs_id_key" ON "ProccessingLogs"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ProccessingLogs_productId_key" ON "ProccessingLogs"("productId");
