const supabase = require("../config/supabase");

exports.create = async (emailAddress) => {
  const { data: emailData, error: emailError } = await supabase
    .from("Email")
    .insert([{ email_address: emailAddress }])
    .select("*")
    .single();

  if (emailError) {
    throw new Error(`Email Error: ${emailError.message}`);
  }

  return emailData;
};

exports.findByEmailAddress = async (emailAddress) => {
  const { data: emailData, error: emailError } = await supabase
    .from("Email")
    .select("*")
    .eq("email_address", emailAddress)
    .single();

  if (emailError) {
    throw new Error(`Email Check Error: ${emailError.message}`);
  }

  return emailData;
};
