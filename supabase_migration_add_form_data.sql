-- Migration: Add form_data column to inspections table
-- This column will store the complete form data as JSON in label-value format
-- Run this in your Supabase SQL editor

-- Add form_data column to inspections table
ALTER TABLE inspections
ADD COLUMN IF NOT EXISTS form_data JSONB DEFAULT '{}'::jsonb;

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_inspections_user_name
ON inspections(user_id, name);

-- Add comment to document the column
COMMENT ON COLUMN inspections.form_data IS 'Complete form data stored as JSON in label-value format: { "P1": { "Field Label": { "label": "Field Label", "value": "..." } } }';
