process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
require("dotenv").config();

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Missing required Supabase environment variables");
}

const { createClient } = require("@supabase/supabase-js");

const supabaseService = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = supabaseService;
