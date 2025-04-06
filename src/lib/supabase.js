import { createClient } from '@supabase/supabase-js';

// Create a Supabase client with the API URL and key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create a single instance of the Supabase client to be used across the application
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default supabase;
