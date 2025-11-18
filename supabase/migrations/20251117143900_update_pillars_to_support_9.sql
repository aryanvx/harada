/*
  # Update Harada Method to Support 9 Pillars

  ## Changes
  
  ### Modified Tables
    - `pillars` table: Update position constraint from 1-8 to 1-9
  
  ## Notes
  - Allows users to create grids with up to 9 pillars instead of 8
  - Existing 8-pillar grids remain fully compatible
  - No data loss or breaking changes
*/

-- Drop the old constraint and add new one for 9 pillars
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'pillars_position_check'
    AND conrelid = 'pillars'::regclass
  ) THEN
    ALTER TABLE pillars DROP CONSTRAINT pillars_position_check;
  END IF;
END $$;

-- Add new constraint allowing positions 1-9
ALTER TABLE pillars ADD CONSTRAINT pillars_position_check CHECK (position >= 1 AND position <= 9);
