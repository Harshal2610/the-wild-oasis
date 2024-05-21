import { createClient } from "@supabase/supabase-js";
export const supabaseUrl = "https://jzhbsmyyznxbfirgvfsr.supabase.co";
const supabaseKey = process.env.SUPABASE_API_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
