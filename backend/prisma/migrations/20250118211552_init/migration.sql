-- CreateEnum
CREATE TYPE "SyncStatus" AS ENUM ('SUCCESS', 'FAILURE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupabaseConnection" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "connectionName" TEXT NOT NULL,
    "anonApiKey" TEXT NOT NULL,
    "projectUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "SupabaseConnection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AirtableConnection" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "connectionName" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "baseId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "AirtableConnection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SyncMapping" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "supabaseConnectionId" TEXT NOT NULL,
    "airtableConnectionId" TEXT NOT NULL,
    "supabaseTable" TEXT NOT NULL,
    "airtableTable" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "SyncMapping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SyncLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "syncMappingId" TEXT NOT NULL,
    "status" "SyncStatus" NOT NULL,
    "details" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SyncLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "SupabaseConnection" ADD CONSTRAINT "SupabaseConnection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AirtableConnection" ADD CONSTRAINT "AirtableConnection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SyncMapping" ADD CONSTRAINT "SyncMapping_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SyncMapping" ADD CONSTRAINT "SyncMapping_supabaseConnectionId_fkey" FOREIGN KEY ("supabaseConnectionId") REFERENCES "SupabaseConnection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SyncMapping" ADD CONSTRAINT "SyncMapping_airtableConnectionId_fkey" FOREIGN KEY ("airtableConnectionId") REFERENCES "AirtableConnection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SyncLog" ADD CONSTRAINT "SyncLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SyncLog" ADD CONSTRAINT "SyncLog_syncMappingId_fkey" FOREIGN KEY ("syncMappingId") REFERENCES "SyncMapping"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
