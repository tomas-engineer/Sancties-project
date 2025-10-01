-- CreateTable
CREATE TABLE "Sanctie" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "naam" TEXT NOT NULL,
    "niveau" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Leerling" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "naam" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Straffen" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "leerlingId" INTEGER NOT NULL,
    "sanctieId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Straffen_leerlingId_fkey" FOREIGN KEY ("leerlingId") REFERENCES "Leerling" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Straffen_sanctieId_fkey" FOREIGN KEY ("sanctieId") REFERENCES "Sanctie" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Straffen_leerlingId_sanctieId_key" ON "Straffen"("leerlingId", "sanctieId");
