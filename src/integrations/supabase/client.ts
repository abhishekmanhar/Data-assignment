// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://gwmqkzceglamolbtklwe.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3bXFremNlZ2xhbW9sYnRrbHdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDExNTU4OTUsImV4cCI6MjA1NjczMTg5NX0.Hs7k-p4uRnx7cdOjQjH5HNvAvK_EjSeARCO7bWXo630";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);