-- Migration script to add SMS notification fields to existing tables
-- Run this if you already have the spots and queue tables created

-- Add phone number and notification fields to spots table
ALTER TABLE spots 
ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS notify_on_timeout BOOLEAN DEFAULT FALSE;

-- Add phone number and notification fields to queue table
ALTER TABLE queue 
ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS notify_on_available BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS notify_on_timeout BOOLEAN DEFAULT FALSE;

-- Add index for phone number lookups
CREATE INDEX IF NOT EXISTS idx_phone_number ON queue(phone_number);
