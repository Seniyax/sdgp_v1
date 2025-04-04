const supabase = require("../config/supabaseClient");
const supabaseService = require("../config/supabaseService");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const validateTime = (time) => {
  const regex = /^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/;
  return regex.test(time) ? null : "Invalid time format. Expected HH:MM:SS";
};

async function uploadImage(file, folder) {
  const extension = path.extname(file.originalname);
  const baseName = path
    .basename(file.originalname, extension)
    .replace(/[^a-zA-Z0-9.\-_]/g, "");
  const uniqueFileName = `${uuidv4()}-${baseName}${extension}`;
  const filePath = `${folder}/${uniqueFileName}`;

  const { data, error } = await supabaseService.storage
    .from("images")
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
      upsert: true,
    });
  if (error) {
    throw error;
  }

  const { data: publicUrlData, error: urlError } = supabaseService.storage
    .from("images")
    .getPublicUrl(filePath);
  if (urlError) {
    throw urlError;
  }
  if (!publicUrlData || !publicUrlData.publicUrl) {
    throw new Error("Failed to retrieve public URL");
  }
  return publicUrlData.publicUrl;
}

async function createBusinessRecord(
  name,
  categoryId,
  locationId,
  verificationToken,
  description,
  website,
  logoUrl,
  coverUrl,
  opening_hour,
  closing_hour,
  facebook_link,
  instagram_link,
  twitter_link
) {
  const opErrorMessage = validateTime(opening_hour);
  if (opErrorMessage) throw new Error(opErrorMessage);
  const clErrorMessage = validateTime(closing_hour);
  if (clErrorMessage) throw new Error(clErrorMessage);

  const { data, error } = await supabase
    .from("business")
    .insert([
      {
        name,
        category_id: categoryId,
        location_id: locationId,
        is_verified: false,
        verification_token: verificationToken,
        description,
        website,
        logo: logoUrl,
        cover: coverUrl,
        opening_hour,
        closing_hour,
        facebook_link,
        instagram_link,
        twitter_link,
      },
    ])
    .select();

  if (error) throw error;

  return data[0];
}

async function updateBusinessRecord(businessId, updateData) {
  const { data, error } = await supabase
    .from("business")
    .update(updateData)
    .eq("id", businessId)
    .select();
  if (error) throw error;
  return data;
}

async function getAllBusinesses() {
  const { data, error } = await supabase.from("business").select("*");
  if (error) throw error;
  return data;
}

async function getBusinessesMinimal() {
  const { data, error } = await supabase
    .from("business")
    .select("id, name, is_verified");
  if (error) throw error;
  return data;
}

async function getOneBusiness(businessId) {
  const { data, error } = await supabase
    .from("business")
    .select("*, category:category_id(name)")
    .eq("id", businessId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

async function deleteBusiness(businessId) {
  const { data, error } = await supabase
    .from("business")
    .delete()
    .eq("id", businessId)
    .select();
  if (error) throw error;
  return data;
}

async function verifyBusinessEmail(token) {
  const { data, error } = await supabase
    .from("business")
    .select("*")
    .eq("verification_token", token)
    .single();
  if (error || !data) {
    throw new Error("The token provided is invalid or has expired.");
  }
  const { error: updateError } = await supabase
    .from("business")
    .update({ is_verified: true, verification_token: null })
    .eq("id", data.id);
  if (updateError) {
    throw new Error(
      "We encountered an issue verifying your business email. Please try again later."
    );
  }
  return data;
}

module.exports = {
  createBusinessRecord,
  updateBusinessRecord,
  getAllBusinesses,
  getBusinessesMinimal,
  getOneBusiness,
  deleteBusiness,
  verifyBusinessEmail,
  uploadImage,
};
