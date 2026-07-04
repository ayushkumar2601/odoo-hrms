-- SQL Script to apply Phase B Zindle AI Copilot schema changes to Supabase PostgreSQL database
-- Run this directly in the Supabase SQL Editor:

CREATE TABLE IF NOT EXISTS "public"."Report" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "generatedBy" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "fileData" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- Index for faster retrieval by role and author
CREATE INDEX IF NOT EXISTS "Report_generatedBy_idx" ON "public"."Report"("generatedBy");
CREATE INDEX IF NOT EXISTS "Report_type_idx" ON "public"."Report"("type");
