const supabase = require("../config/supabaseClient");
const supabaseService = require("../config/supabaseService");

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
    .eq("username", username)
    .select();
  if (error) throw error;
  return data[0];
}

async function deleteUser(username) {
  const { data, error } = await supabase
    .from("user")
    .delete()
    .eq("username", username);
  if (error) throw error;
  return data;
}

async function getUserByEmail(email) {
  const { data, error } = await supabase
    .from("user")
    .select("*")
    .eq("email", email)
    .maybeSingle();
  if (error) throw error;
  return data;
}

async function setPasswordResetToken(email, token) {
  const { data, error } = await supabase
    .from("user")
    .update({
      password_reset_token: token,
    })
    .eq("email", email);
  if (error) throw error;
  return data;
}

async function setPasswordResetTokenToReady(token) {
  const { data, error } = await supabase
    .from("user")
    .update({
      password_reset_token: "Ready",
    })
    .eq("password_reset_token", token);
  if (error) throw error;
  return data;
}

async function getUserByPasswordResetToken(token) {
  const { data, error } = await supabase
    .from("user")
    .select("*")
    .eq("password_reset_token", token)
    .maybeSingle();
  if (error) throw error;
  return data;
}

async function updateUserPassword(userId, hashedPassword) {
  const { data, error } = await supabase
    .from("user")
    .update({
      password: hashedPassword,
      password_reset_token: null,
    })
    .eq("id", userId);
  if (error) throw error;
  return data;
}

async function verifyUserEmail(token) {
  const { data: user, error: selectError } = await supabase
    .from("user")
    .select("*")
    .eq("verification_token", token)
    .single();
  if (selectError) throw selectError;
  if (!user) throw new Error("Invalid or expired token");
  const { error: updateError } = await supabase
    .from("user")
    .update({ is_verified: true, verification_token: null })
    .eq("id", user.id);
  if (updateError) throw updateError;
  return user;
}

async function uploadProfilePicture(username, file) {
  console.log("File Buffer:", file.buffer);
  const fileExt = file.originalname.split(".").pop();
  const fileName = `${username}_${Date.now()}.${fileExt}`;
  const bucketName = "profile-pictures";
  const { data, error: uploadError } = await supabaseService.storage
    .from(bucketName)
    .upload(fileName, file.buffer, {
      contentType: file.mimetype,
      upsert: true,
    });

  if (uploadError) {
    console.error("Upload Error:", uploadError);
    throw uploadError;
  }
  const {
    data: { publicUrl },
  } = supabaseService.storage.from(bucketName).getPublicUrl(fileName);

  if (!publicUrl) {
    console.error("Failed to get public URL");
    throw new Error("Failed to get public URL");
  }

  return publicUrl;
}

module.exports = {
  getUserByUsername,
  createUser,
  updateUser,
  deleteUser,
  getUserById,
  getUserByEmail,
  setPasswordResetToken,
  getUserByPasswordResetToken,
  updateUserPassword,
  verifyUserEmail,
  setPasswordResetTokenToReady,
  uploadProfilePicture,
};
