// Comments by GitHub Copilot

// Import the createClient function from the supabase-js library
import { createClient } from "@supabase/supabase-js";

// Define the URL for your Supabase project
const supabaseUrl = "https://fogthlbsceiiftkwavxi.supabase.co";

// Define the public anon key for your Supabase project
// WARNING: This should be kept secret and not exposed in the client-side code in a real application
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvZ3RobGJzY2VpaWZ0a3dhdnhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTYyNDAwOTksImV4cCI6MjAzMTgxNjA5OX0.-eIfUZsrRHdXZpHCkdR2bD2Bi75qODlmBwlZXBYRDrQ";

// Create a new Supabase client using the URL and key
const supabase = createClient(supabaseUrl, supabaseKey);

// Export the Supabase client for use in other parts of your application
export default supabase;
