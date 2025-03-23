const supabase = require("../config/supabaseClient");
const bcrypt = require("bcrypt");

async function getUserByUsername(username) {
  const { data, error } = await supabase
    .from("user")
    .select("*")
    .eq("username", username)
    .maybeSingle();
  if (error) throw error;
  return data;
}

async function getUserById(id) {
  const { data, error } = await supabase
    .from("user")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

async function createUser({
  name,
  nic,
  email,
  address,
  contact,
  username,
  password,
  verification_token,
}) {
  const { data, error } = await supabase
    .from("user")
    .insert([
      {
        name,
        nic,
        email,
        address,
        contact,
        username,
        password,
        verification_token,
      },
    ])
    .select();
  if (error) throw error;
  return data[0];
}

async function updateUser(username, updateData) {
  const { data, error } = await supabase
    .from("user")
    .update(updateData)
    .eq("username", username);
  if (error) throw error;
  return data;
}

async function deleteUser(username) {
  const { data, error } = await supabase
    .from("user")
    .delete()
    .eq("username", username);
  if (error) throw error;
  return data;
}

module.exports = {
  getUserByUsername,
  createUser,
  updateUser,
  deleteUser,
  getUserById,
};
