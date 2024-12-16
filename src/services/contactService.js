const supabase = require("../config/supabase");

exports.create = async (number) => {
  const { data: contactData, error: contactError } = await supabase
    .from("Contact")
    .insert([{ number: number }])
    .select("*")
    .single();

  if (contactError) {
    throw new Error(`Contact Error: ${contactError.message}`);
  }

  return contactData;
};

exports.findbyNumber = async (number) => {
  const { data: contactData, error: contactError } = await supabase
    .from("Contact")
    .select("*")
    .eq("number", number)
    .single();

  if (contactError) {
    throw new Error(`Contact Error: ${contactError.message}`);
  }

  return contactData;
};
