const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Example: Querying the 'users' table
async function getUsers() {
  const { data, error } = await supabase
    .from('users')
    .select('*');
  
  if (error) {
    console.error(error);
  } else {
    console.log(data);
  }
}

getUsers();