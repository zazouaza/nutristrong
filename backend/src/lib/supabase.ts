import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Hardcoded credentials as requested for immediate connection
const supabaseUrl = process.env.SUPABASE_URL!;
// WARNING: This key has full administrative access (Service Role)
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabase = createClient(
  supabaseUrl,
  supabaseServiceKey
);