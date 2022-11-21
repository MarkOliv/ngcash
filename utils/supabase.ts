import { createClient } from "@supabase/supabase-js";

const url = "https://bqflshzrxxnjdppqtuwm.supabase.co";
const api =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxZmxzaHpyeHhuamRwcHF0dXdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Njg1MjM0OTksImV4cCI6MTk4NDA5OTQ5OX0.1EIoREgJg6HGZP2vdRqkGuV2i8CpLY80dRvklWPa-QE";

const supabase = createClient(url, api);

export default supabase;
