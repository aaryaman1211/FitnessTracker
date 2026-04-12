import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://cuncviuhohswqgkaijbi.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1bmN2aXVob2hzd3Fna2FpamJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3MTE2NTEsImV4cCI6MjA5MTI4NzY1MX0.J8nRM9WH-1pTFnIbXx938f-_mJ4bBPbqih1h5mrdGno';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);