// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zqcpwetilpqvyitxmuvc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpxY3Bwd2V0aWxwcXZ5aXR4bXV2YyIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzYxNjgwNTg1LCJleHAiOjIwNzc yNTY1ODV9.xqUmdJS9ymiI03djkfg9kDSlhipXxFiXHrjiOlP8j_s';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export type UserRole = 'admin' | 'teacher' | 'student' | 'pending';

export interface Profile {
  id: string;
  full_name: string;
  role: UserRole;
  created_at: string;
}
