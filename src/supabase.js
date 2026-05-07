import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://gusueoxwjcizjrkagvve.supabase.co";

const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd1c2Vlb3h3amNpempya2FndnZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3ODM1ODIsImV4cCI6MjA5MzM1OTU4Mn0.J-n_FkAn_3Pq58av7OF2YhBjYvRwIbCGQ3H3H2uiZ_M";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);