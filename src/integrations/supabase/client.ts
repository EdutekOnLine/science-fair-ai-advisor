// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://mbfuggowxmibivlyrhmc.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1iZnVnZ293eG1pYml2bHlyaG1jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAzNDcxNTcsImV4cCI6MjA1NTkyMzE1N30.BmHByxowrGgChI_IahTM9_GQHVWJSpyLLdc__vK7mik";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);