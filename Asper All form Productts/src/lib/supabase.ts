import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const key =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
  import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * Supabase client for browser (auth, database). Null when URL or key is not configured.
 * NotesPage and other features that need Supabase check for null before use.
 */
export const supabase: SupabaseClient | null =
  url && key ? createClient(url, key) : null;
