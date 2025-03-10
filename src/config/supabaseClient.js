const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    throw new Error('Missing required Supabase environment variables');
}

// Create and export Supabase client
const supabaseClient = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
    {
        auth: {
            autoRefreshToken: true,
            persistSession: true
        }
    }
);

// Test connection
const testConnection = async () => {
    try {
        await supabaseClient.auth.getSession();
        console.log('✅ Supabase connection successful');
    } catch (error) {
        console.error('❌ Supabase connection error:', error);
    }
};

testConnection();

module.exports = supabaseClient;
