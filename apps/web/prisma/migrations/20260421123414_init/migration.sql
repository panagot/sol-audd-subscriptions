-- CreateTable
CREATE TABLE "Plan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "merchantPubkey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "amountAtomic" TEXT NOT NULL,
    "interval" TEXT NOT NULL DEFAULT 'month',
    "feeBps" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "planId" TEXT NOT NULL,
    "subscriberPubkey" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "nextDue" DATETIME,
    "lastPaidTx" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Subscription_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Subscription_planId_idx" ON "Subscription"("planId");

-- CreateIndex
CREATE INDEX "Subscription_subscriberPubkey_idx" ON "Subscription"("subscriberPubkey");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_planId_subscriberPubkey_key" ON "Subscription"("planId", "subscriberPubkey");
