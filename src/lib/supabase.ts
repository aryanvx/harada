import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Goal {
  id: string;
  goal_text: string;
  is_public: boolean;
  share_token: string;
  created_at: string;
  updated_at: string;
}

export interface Pillar {
  id: string;
  goal_id: string;
  pillar_text: string;
  position: number;
  created_at: string;
}

export interface Task {
  id: string;
  pillar_id: string;
  task_text: string;
  position: number;
  created_at: string;
}

export interface HaradaGrid {
  goal: Goal;
  pillars: Array<Pillar & { tasks: Task[] }>;
}
