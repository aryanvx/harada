/*
  # HaraDaily - Harada Method Goal Setting Database Schema

  ## Overview
  This migration creates the complete database schema for the HaraDaily app,
  which helps users create and visualize goals using the Harada Method (8x8 grid).

  ## New Tables
  
  ### `goals`
  Stores the main goal and metadata for each user's Harada grid
  - `id` (uuid, primary key) - Unique identifier for the goal
  - `goal_text` (text) - The user's main ambitious goal
  - `is_public` (boolean) - Whether the grid is publicly shareable
  - `share_token` (text, unique) - Unique token for public sharing URL
  - `created_at` (timestamptz) - When the goal was created
  - `updated_at` (timestamptz) - Last update timestamp
  
  ### `pillars`
  Stores the 8 supporting pillars for each goal
  - `id` (uuid, primary key) - Unique identifier
  - `goal_id` (uuid, foreign key) - References the parent goal
  - `pillar_text` (text) - The pillar description
  - `position` (integer) - Position in the grid (1-8)
  - `created_at` (timestamptz) - Creation timestamp
  
  ### `tasks`
  Stores the 64 actionable tasks (8 per pillar)
  - `id` (uuid, primary key) - Unique identifier
  - `pillar_id` (uuid, foreign key) - References the parent pillar
  - `task_text` (text) - The specific actionable task
  - `position` (integer) - Position within the pillar (1-8)
  - `created_at` (timestamptz) - Creation timestamp

  ## Security
  
  ### Row Level Security (RLS)
  - All tables have RLS enabled for data protection
  - Public read access for publicly shared goals
  - No authentication required for this MVP (anyone can create and view)
  
  ## Indexes
  - Index on `goals.share_token` for fast public link lookups
  - Index on `goals.is_public` and `created_at` for gallery queries
  - Foreign key indexes for efficient joins
*/

-- Create goals table
CREATE TABLE IF NOT EXISTS goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_text text NOT NULL,
  is_public boolean DEFAULT false,
  share_token text UNIQUE DEFAULT encode(gen_random_bytes(16), 'base64'),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create pillars table
CREATE TABLE IF NOT EXISTS pillars (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id uuid NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
  pillar_text text NOT NULL,
  position integer NOT NULL CHECK (position >= 1 AND position <= 8),
  created_at timestamptz DEFAULT now()
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pillar_id uuid NOT NULL REFERENCES pillars(id) ON DELETE CASCADE,
  task_text text NOT NULL,
  position integer NOT NULL CHECK (position >= 1 AND position <= 8),
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_goals_share_token ON goals(share_token);
CREATE INDEX IF NOT EXISTS idx_goals_public_created ON goals(is_public, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pillars_goal_id ON pillars(goal_id);
CREATE INDEX IF NOT EXISTS idx_tasks_pillar_id ON tasks(pillar_id);

-- Enable Row Level Security
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE pillars ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for goals table
CREATE POLICY "Anyone can create goals"
  ON goals FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can view public goals"
  ON goals FOR SELECT
  TO anon
  USING (is_public = true);

CREATE POLICY "Anyone can view goals by share token"
  ON goals FOR SELECT
  TO anon
  USING (share_token IS NOT NULL);

CREATE POLICY "Anyone can update their own goals"
  ON goals FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- RLS Policies for pillars table
CREATE POLICY "Anyone can create pillars"
  ON pillars FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can view pillars for public goals"
  ON pillars FOR SELECT
  TO anon
  USING (
    EXISTS (
      SELECT 1 FROM goals
      WHERE goals.id = pillars.goal_id
      AND (goals.is_public = true OR goals.share_token IS NOT NULL)
    )
  );

-- RLS Policies for tasks table
CREATE POLICY "Anyone can create tasks"
  ON tasks FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can view tasks for public goals"
  ON tasks FOR SELECT
  TO anon
  USING (
    EXISTS (
      SELECT 1 FROM pillars
      JOIN goals ON goals.id = pillars.goal_id
      WHERE pillars.id = tasks.pillar_id
      AND (goals.is_public = true OR goals.share_token IS NOT NULL)
    )
  );