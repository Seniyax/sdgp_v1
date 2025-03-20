const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY,{
    auth:{
        autoRefreshToken:true,
        persistSession:true,
        detectSessionInUrl:true
    }
});

module.exports = supabase;
