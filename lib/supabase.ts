import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://rcrusmgsenbkcsebgdoy.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjcnVzbWdzZW5ia2NzZWJnZG95Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1NTI2MTUsImV4cCI6MjA4ODEyODYxNX0.DSg21HoXOAiDJ3shm4jPYyLGDRH6D6uCdQzFzFjp2qA";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);