import axios from "axios";

const apiSupabase = axios.create({
  baseURL: process.env.SUPABASE_URL,
  headers: {
    apikey: process.env.SUPABASE_SECRET_KEY,
    Authorization: `Bearer ${process.env.SUPABASE_SECRET_KEY}`,
  },
});

export default apiSupabase;
