-- CreateTable
CREATE TABLE "Record" (
    "id" INTEGER NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "species" TEXT NOT NULL,
    "count" INTEGER NOT NULL,
    "behavior" TEXT NOT NULL,
    "observedAt" TIMESTAMP(3) NOT NULL,
    "mediaUrl" TEXT,
    "comment" TEXT,
    "reporter" TEXT NOT NULL,
    "blockNumber" BIGINT NOT NULL,
    "txHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Record_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IndexerState" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "lastBlock" BIGINT NOT NULL DEFAULT 0,

    CONSTRAINT "IndexerState_pkey" PRIMARY KEY ("id")
);
