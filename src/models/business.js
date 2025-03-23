const supabase = require("../config/supabaseClient");
const { v4: uuidv4 } = require("uuid");

async function createBusinessRecord(
  name,
  categoryId,
  locationId,
  verificationToken,
  description,
  website,
  logo,
  cover,
  opening_hour,
  closing_hour,
  facebook_link,
  instagram_link,
  twitter_link
) {
  try {
    const uniqueLogoName = `${uuidv4()}-${logo.originalname}`;
    const uniqueCoverName = `${uuidv4()}-${cover.originalname}`;

    const [logoUpload, coverUpload] = await Promise.allSettled([
      supabase.storage.from("images").upload(`logos/${uniqueLogoName}`, logo),
      supabase.storage
        .from("images")
        .upload(`covers/${uniqueCoverName}`, cover),
    ]);

    if (logoUpload.status === "rejected") {
      console.error("Error uploading logo:", logoUpload.reason);
      throw new Error(`Error uploading logo: ${logoUpload.reason.message}`);
    }

    if (coverUpload.status === "rejected") {
      console.error("Error uploading cover:", coverUpload.reason);
      throw new Error(`Error uploading cover: ${coverUpload.reason.message}`);
    }

    const logoUrl = supabase.storage
      .from("images")
      .getPublicUrl(`logos/${uniqueLogoName}`).publicURL;
    const coverUrl = supabase.storage
      .from("images")
      .getPublicUrl(`covers/${uniqueCoverName}`).publicURL;

    if (!logoUrl || !coverUrl) {
      throw new Error("Failed to retrieve image URLs");
    }

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
  } catch (error) {
    console.error("Error creating business record:", error.message);
    throw error;
  }
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
  const { data, error } = await supabase.from("business").select("id, name, is_verified");
  if (error) throw error;
  return data;
}

async function getOneBusiness(businessId) {
  const { data, error } = await supabase
    .from("business")
    .select("*")
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

module.exports = {
  createBusinessRecord,
  updateBusinessRecord,
  getAllBusinesses,
  getBusinessesMinimal,
  getOneBusiness,
  deleteBusiness,
};
