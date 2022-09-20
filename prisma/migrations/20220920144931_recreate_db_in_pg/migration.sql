-- CreateTable
CREATE TABLE "Product" (
    "lm" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "free_shipping" BOOLEAN NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "category" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ProccessingLogs" (
    "id" TEXT NOT NULL,
    "ready" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_lm_key" ON "Product"("lm");

-- CreateIndex
CREATE UNIQUE INDEX "ProccessingLogs_id_key" ON "ProccessingLogs"("id");
