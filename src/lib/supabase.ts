import { createClient } from '@supabase/supabase-js';

// Using the credentials provided in the prompt for demonstration purposes.
// In a production environment, these should be in environment variables.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://vibmycevwkpivsfhzjka.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpYm15Y2V2d2twaXZzZmh6amthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MDgwNzQsImV4cCI6MjA4NzE4NDA3NH0.5C7YkhO_cmQ-nQyW3mfPJRz5PSIVk8GnX1kGsM4i4Fg';

export const supabase = createClient(supabaseUrl, supabaseKey);
