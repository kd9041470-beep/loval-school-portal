import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nytusadzlvtegtsynxuc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55dHVzYWR6bHZ0ZWd0c3lueHVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxOTY2MzYsImV4cCI6MjA3NTc3MjYzNn0.iJYc7tae4sgeSTzG8m8whr_1W7gnbMJiPjMqNDfOHW0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export type UserRole = 'admin' | 'teacher' | 'student';

export interface Profile {
  id: string;
  full_name: string;
  role: UserRole;
  created_at: string;
}
