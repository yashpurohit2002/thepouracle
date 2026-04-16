-- Migration: add calories column to drinks table
-- Run this in Supabase SQL Editor if you already ran schema.sql

alter table drinks add column if not exists calories integer;
