/*
  # Revert Pillars Back to 8

  ## Changes
  
  ### Modified Tables
    - `pillars` table: Revert position constraint back to 1-8
  
  ## Notes
  - Restoring original 8-pillar Harada Method structure
  - Grid layout will be 3x3 with 8 pillar grids around 1 center goal block
*/

-- Drop the 9-pillar constraint
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

-- Restore original constraint for 8 pillars
ALTER TABLE pillars ADD CONSTRAINT pillars_position_check CHECK (position >= 1 AND position <= 8);
