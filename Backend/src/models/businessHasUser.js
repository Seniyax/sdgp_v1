const supabase = require("../config/supabaseClient");
const { getUserByUsername } = require("./user");

async function createBusinessRelation({
  user_id,
  business_id,
  type,
  supervisor_id,
  verification_token,
  is_verified = false,
}) {
  if (type === "Owner") {
    verification_token = null;
    is_verified = true;
  }
  const { data, error } = await supabase
    .from("business_has_user")
    .insert([
      {
        user_id,
        business_id,
        type,
        supervisor_id,
        verification_token,
        is_verified,
      },
    ])
    .select();
  if (error) throw error;
  return data[0];
}

async function createBusinessRelations(
  businessRelations,
  business_id,
  supervisor_id
) {
  const formattedbusinessRelations = [];
  for (let businessRelation of businessRelations) {
    const user = await getUserByUsername(businessRelation.username);
    formattedbusinessRelations.push({
      user_id: user.id,
      business_id,
      type: businessRelation.type,
      supervisor_id,
      verification_token: null,
      is_verified: true,
    });
  }

  const { data, error } = await supabase
    .from("business_has_user")
    .insert(formattedbusinessRelations)
    .select();
  if (error) throw error;
  return data;
}

async function getBusinessRelationsByUser(userId) {
  const { data, error } = await supabase
    .from("business_has_user")
    .select(
      `
    id,
    user_id,
    business_id,
    type,
    is_verified,
    verification_token,
    supervisor_id,
    business (name)
  `
    )
    .eq("user_id", userId);
  if (error) throw error;
  return data;
}

async function deleteBusinessRelations(businessId) {
  const { data, error } = await supabase
    .from("business_has_user")
    .delete()
    .eq("business_id", businessId)
    .neq("type", "Owner")
    .select();
  if (error) throw error;
  return data;
}

async function getUserRelationsByBusiness(business_id) {
  const { data, error } = await supabase
    .from("business_has_user")
    .select("*")
    .eq("business_id", business_id);
  if (error) throw error;
  return data;
}

async function processBHUUpdate(businessId, requestUsers) {
  let requestUserIds = [];
  for (const reqUser of requestUsers) {
    const userRec = await getUserByUsername(reqUser.username);
    if (userRec) {
      requestUserIds.push({ user_id: userRec.id, type: reqUser.type });
    }
  }
  const { data: currentBHUs, error } = await supabase
    .from("business_has_user")
    .select("*")
    .eq("business_id", businessId);
  if (error) throw error;
  let rollbackBHU = { deletedRecords: [], updatedRecords: [] };
  for (const currentBHU of currentBHUs) {
    if (!requestUserIds.some((u) => u.user_id === currentBHU.user_id)) {
      const { error: deleteError } = await supabase
        .from("business_has_user")
        .delete()
        .eq("id", currentBHU.id)
        .select();
      if (deleteError) throw deleteError;
      rollbackBHU.deletedRecords.push(currentBHU);
    }
  }
  for (const reqUser of requestUserIds) {
    const matchingRecord = currentBHUs.find(
      (bhu) => bhu.user_id === reqUser.user_id
    );
    if (matchingRecord && matchingRecord.type !== reqUser.type) {
      rollbackBHU.updatedRecords.push({
        id: matchingRecord.id,
        previousType: matchingRecord.type,
      });
      const { error: updateError } = await supabase
        .from("business_has_user")
        .update({ type: reqUser.type })
        .eq("id", matchingRecord.id);
      if (updateError) throw updateError;
    }
  }
  return rollbackBHU;
}

async function buildUsersForBusiness(businessId) {
  const { data: bhuData, error: bhuError } = await supabase
    .from("business_has_user")
    .select("*")
    .eq("business_id", businessId);
  if (bhuError) throw bhuError;
  const users = await Promise.all(
    bhuData.map(async (bhu) => {
      const { data: userData, error: userError } = await supabase
        .from("user")
        .select("name, email, username")
        .eq("id", bhu.user_id)
        .maybeSingle();
      if (userError) throw userError;
      return {
        name: userData ? userData.name : "",
        email: userData ? userData.email : "",
        username: userData ? userData.username : "",
        type: bhu.type,
      };
    })
  );
  return users;
}

module.exports = {
  createBusinessRelation,
  createBusinessRelations,
  getBusinessRelationsByUser,
  getUserRelationsByBusiness,
  processBHUUpdate,
  buildUsersForBusiness,
  deleteBusinessRelations,
};
