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
    console.log(businessRelation.username);
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
      business (
        id,
        name,
        is_verified,
        emails: email (
          email_address,
          email_type: email_type ( name )
        )
      ),
      supervisor: "user"!fk_supervisor ( name )
      `
    )
    .eq("user_id", userId)
    .order("id", { ascending: true });

  if (error) {
    throw error;
  }

  const safeData = data || [];
  safeData.forEach((relation) => {
    if (relation.business && relation.business.emails) {
      relation.business.primary_email = relation.business.emails.find(
        (email) => email.email_type && email.email_type.name === "Primary"
      );
    }
  });
  return safeData;
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
    .select("*, user:user_id(*), supervisor:supervisor_id(*)")
    .eq("business_id", business_id)
    .order("id", { ascending: true });
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
  const { data, error } = await supabase
    .from("business_has_user")
    .select("type, user:user (name, email, username)")
    .eq("business_id", businessId);

  if (error) throw error;

  return data.map((record) => ({
    name: record.user?.name || "",
    email: record.user?.email || "",
    username: record.user?.username || "",
    type: record.type,
  }));
}

async function verifyBusinessRelationByToken(token) {
  const { data, error: selectError } = await supabase
    .from("business_has_user")
    .select("*")
    .eq("verification_token", token)
    .single();
  if (selectError) throw selectError;
  if (!data) throw new Error("Invalid or expired token");

  const { error: updateError } = await supabase
    .from("business_has_user")
    .update({ is_verified: true, verification_token: null })
    .eq("id", data.id);
  if (updateError) throw updateError;

  return data;
}

module.exports = {
  createBusinessRelation,
  createBusinessRelations,
  getBusinessRelationsByUser,
  getUserRelationsByBusiness,
  processBHUUpdate,
  buildUsersForBusiness,
  deleteBusinessRelations,
  verifyBusinessRelationByToken,
};
