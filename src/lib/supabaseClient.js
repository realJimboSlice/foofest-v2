import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://fogthlbsceiiftkwavxi.supabase.co";

const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvZ3RobGJzY2VpaWZ0a3dhdnhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTYyNDAwOTksImV4cCI6MjAzMTgxNjA5OX0.-eIfUZsrRHdXZpHCkdR2bD2Bi75qODlmBwlZXBYRDrQ";

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
