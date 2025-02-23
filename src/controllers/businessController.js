const supabase = require("../config/supabaseClient");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const emailValidation = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email) ? null : "Invalid email address format";
};

const contactValidation = (contact) => {
  const regex = /^[0-9]{10,15}$/;
  return regex.test(contact) ? null : "Invalid contact number format";
};

async function getCategoryId(categoryName) {
  const { data, error } = await supabase
    .from("category")
    .select("id")
    .eq("name", categoryName)
    .single();

  if (error) throw error;
  return data ? data.id : null;
}

async function getCategoryName(categoryId) {
  const { data, error } = await supabase
    .from("category")
    .select("name")
    .eq("id", categoryId)
    .single();

  if (error) throw error;
  return data ? data.name : null;
}

async function getUserByUsername(username) {
  const { data, error } = await supabase
    .from("user")
    .select("*")
    .eq("username", username)
    .maybeSingle();

  if (error) throw error;
  return data;
}

async function getLocationDetails(locationId) {
  const { data, error } = await supabase
    .from("location")
    .select("line1, line2, line3, country")
    .eq("id", locationId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

async function buildEmails(businessId) {
  const { data: emailsData, error: emailsError } = await supabase
    .from("email")
    .select("*")
    .eq("business_id", businessId);

  if (emailsError) throw emailsError;

  const emails = await Promise.all(
    emailsData.map(async (email) => {
      const { data: emailTypeData, error: emailTypeError } = await supabase
        .from("email_type")
        .select("name")
        .eq("id", email.email_type_id)
        .maybeSingle();

      if (emailTypeError) throw emailTypeError;

      return {
        address: email.email_address,
        type: emailTypeData ? emailTypeData.name : "",
      };
    })
  );

  return emails;
}

async function getContacts(businessId) {
  const { data, error } = await supabase
    .from("contact")
    .select("number")
    .eq("business_id", businessId);

  if (error) throw error;

  return data.map((contact) => ({ number: contact.number }));
}

async function buildUsers(businessId) {
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

async function buildBusinessDetails(business) {
  const categoryName = await getCategoryName(business.category_id);
  const location = await getLocationDetails(business.location_id);
  const emails = await buildEmails(business.id);
  const contacts = await getContacts(business.id);
  const users = await buildUsers(business.id);

  return {
    business: {
      name: business.name,
      category: categoryName,
      location: location || {},
    },
    emails,
    contacts,
    users,
  };
}

async function createLocation(location) {
  const { data, error } = await supabase
    .from("location")
    .insert([
      {
        line1: location.line1,
        line2: location.line2,
        line3: location.line3,
        country: location.country,
      },
    ])
    .select();

  if (error) throw error;

  return data[0];
}

async function createBusinessRecord(
  name,
  categoryId,
  locationId,
  verificationToken
) {
  const { data, error } = await supabase
    .from("business")
    .insert([
      {
        name,
        category_id: categoryId,
        location_id: locationId,
        is_verified: false,
        verification_token: verificationToken,
      },
    ])
    .select();

  if (error) throw error;

  return data[0];
}

async function createPrimaryEmail(businessId, email_address) {
  const { data, error } = await supabase
    .from("email")
    .insert([
      {
        email_address,
        business_id: businessId,
      },
    ])
    .select();

  if (error) throw error;

  return data[0];
}

async function createContacts(businessId, contacts) {
  const contactsToInsert = contacts.map((contact) => ({
    number: contact,
    business_id: businessId,
  }));
  const { data, error } = await supabase
    .from("contact")
    .insert(contactsToInsert)
    .select();

  if (error) throw error;

  return data;
}

async function createBHURelation(businessId, owner) {
  const { data, error } = await supabase
    .from("business_has_user")
    .insert([
      {
        business_id: businessId,
        user_id: owner,
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

async function updatePrimaryEmail(emailId, newEmailAddress) {
  const { error } = await supabase
    .from("email")
    .update({ email_address: newEmailAddress })
    .eq("id", emailId);

  if (error) throw error;
}

async function deleteNonPrimaryEmails(businessId) {
  const { data, error } = await supabase
    .from("email")
    .delete()
    .eq("business_id", businessId)
    .neq("email_type_id", 1)
    .select();

  if (error) throw error;

  return data;
}

async function insertNonPrimaryEmails(businessId, emails) {
  let insertedIds = [];

  for (const email of emails) {
    const { data, error } = await supabase
      .from("email")
      .insert({
        business_id: businessId,
        email_address: email.email_address,
        email_type_id: email.email_type,
      })
      .select();

    if (error) throw error;
    insertedIds.push(data[0].id);
  }

  return insertedIds;
}

async function updateLocationRecord(locationId, updateData) {
  const { error } = await supabase
    .from("location")
    .update(updateData)
    .eq("id", locationId);

  if (error) throw error;
}

async function updateContact(contactId, newNumber) {
  const { error } = await supabase
    .from("contact")
    .update({ number: newNumber })
    .eq("id", contactId);

  if (error) throw error;
}

async function insertContact(businessId, number) {
  const { data, error } = await supabase
    .from("contact")
    .insert({ number, business_id: businessId })
    .select();

  if (error) throw error;

  return data[0].id;
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

async function rollbackUpdate(rollbackData) {
  if (rollbackData.businessBackup && rollbackData.businessId) {
    await supabase
      .from("business")
      .update(rollbackData.businessBackup)
      .eq("id", rollbackData.businessId);
  }

  if (rollbackData.locationBackup && rollbackData.locationId) {
    await supabase
      .from("location")
      .update(rollbackData.locationBackup)
      .eq("id", rollbackData.locationId);
  }

  if (rollbackData.updatedPrimaryEmailId && rollbackData.previousPrimaryEmail) {
    await supabase
      .from("email")
      .update({ email_address: rollbackData.previousPrimaryEmail })
      .eq("id", rollbackData.updatedPrimaryEmailId);
  }

  if (rollbackData.deletedEmails && rollbackData.deletedEmails.length > 0) {
    await supabase.from("email").insert(rollbackData.deletedEmails);
  }

  if (rollbackData.insertedEmails && rollbackData.insertedEmails.length > 0) {
    for (let emailId of rollbackData.insertedEmails) {
      await supabase.from("email").delete().eq("id", emailId);
    }
  }

  if (rollbackData.updatedContacts && rollbackData.updatedContacts.length > 0) {
    for (const contact of rollbackData.updatedContacts) {
      await supabase
        .from("contact")
        .update({ number: contact.previousNumber })
        .eq("id", contact.id);
    }
  }

  if (
    rollbackData.insertedContacts &&
    rollbackData.insertedContacts.length > 0
  ) {
    for (let contactId of rollbackData.insertedContacts) {
      await supabase.from("contact").delete().eq("id", contactId);
    }
  }

  if (
    rollbackData.deletedBHURecords &&
    rollbackData.deletedBHURecords.length > 0
  ) {
    await supabase
      .from("business_has_user")
      .insert(rollbackData.deletedBHURecords);
  }

  if (
    rollbackData.updatedBHURecords &&
    rollbackData.updatedBHURecords.length > 0
  ) {
    for (const record of rollbackData.updatedBHURecords) {
      await supabase
        .from("business_has_user")
        .update({ type: record.previousType })
        .eq("id", record.id);
    }
  }
}

async function sendVerificationEmail(email, token) {
  const verificationLink = `http://localhost:3000/api/email/verify?token=${token}`;
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "uvindu.dev.slotzi@gmail.com",
      pass: "hamt munu none azjv",
    },
  });
  const mailOptions = {
    from: "uvindu.dev.slotzi@gmail.com",
    to: email,
    subject: "Verify Your Email Address",
    html: `
      <html>
        <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
          <div style="max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 5px; text-align: center;">
            <h2 style="color: #333;">Welcome to SlotZi!</h2>
            <p style="color: #555;">Thank you for registering. Please click the button below to verify your email address.</p>
            <a href="${verificationLink}" 
               style="display: inline-block; padding: 10px 20px; margin: 20px 0; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">
              Verify Email
            </a>
            <p style="color: #888; font-size: 12px;">If you did not create an account, please ignore this email.</p>
            <p style="color: #888; font-size: 12px;">Thanks,<br>The SlotZi Team</p>
          </div>
        </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
}

exports.getAllBusinesses = async (req, res) => {
  try {
    const { data: businesses, error: businessError } = await supabase
      .from("business")
      .select("*");

    if (businessError) throw businessError;

    if (!businesses || businesses.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No businesses found",
      });
    }

    const results = await Promise.all(
      businesses.map((biz) => buildBusinessDetails(biz))
    );

    res.status(200).json({
      success: true,
      message: "Businesses fetched successfully",
      data: results,
    });
  } catch (error) {
    console.error("Error fetching businesses:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch businesses",
      error: error.message,
    });
  }
};

exports.getOneBusiness = async (req, res) => {
  try {
    const { business_id } = req.body;

    if (!business_id) {
      return res.status(400).json({
        success: false,
        message: "Business ID is required",
      });
    }

    const { data: business, error: businessError } = await supabase
      .from("business")
      .select("*")
      .eq("id", business_id)
      .maybeSingle();

    if (businessError) throw businessError;

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Business not found",
      });
    }

    const details = await buildBusinessDetails(business);

    res.status(200).json({
      success: true,
      message: "Business fetched successfully",
      data: details,
    });
  } catch (error) {
    console.error("Error fetching business:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch business",
      error: error.message,
    });
  }
};

exports.createBusiness = async (req, res) => {
  let rollbackData = {};
  try {
    const { username, name, email_address, location, contacts, category_name } =
      req.body;

    if (!name || !email_address || !location || !contacts || !category_name) {
      return res.status(400).json({
        success: false,
        message: "All business details are required",
      });
    }

    const owner = await getUserByUsername(username);
    if (!owner) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid username" });
    }

    const businessEmailError = emailValidation(email_address);
    if (businessEmailError) {
      return res.status(400).json({
        success: false,
        message: businessEmailError,
      });
    }

    for (let contact of contacts) {
      const contactError = contactValidation(contact);
      if (contactError) {
        return res.status(400).json({
          success: false,
          message: contactError,
        });
      }
    }

    const categoryId = await getCategoryId(category_name);
    if (!categoryId) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const loc = await createLocation(location);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const businessRecord = await createBusinessRecord(
      name,
      categoryId,
      loc.id,
      verificationToken
    );
    rollbackData.businessId = businessRecord.id;

    const emailRecord = await createPrimaryEmail(
      businessRecord.id,
      email_address
    );
    const contactsRecord = await createContacts(businessRecord.id, contacts);
    const bHURecord = await createBHURelation(businessRecord.id, owner);

    await sendVerificationEmail(email_address, verificationToken);

    res.status(201).json({
      success: true,
      message: "Business created successfully",
      data: {
        business: businessRecord,
        location: loc,
        email: emailRecord,
        contacts: contactsRecord,
        verification_token: verificationToken,
        business_user_relation: bHURecord,
      },
    });
  } catch (error) {
    console.error("Error creating business:", error);

    if (rollbackData.businessId) {
      await supabase
        .from("business")
        .delete()
        .eq("id", rollbackData.businessId);
    }

    res.status(500).json({
      success: false,
      message: "Failed to create business",
      error: error.message,
    });
  }
};

exports.updateBusiness = async (req, res) => {
  let rollbackData = {
    businessId: null,
    businessBackup: null,
    locationId: null,
    locationBackup: null,
    updatedPrimaryEmailId: null,
    previousPrimaryEmail: null,
    insertedEmails: [],
    deletedEmails: [],
    updatedContacts: [],
    insertedContacts: [],
    deletedBHURecords: [],
    updatedBHURecords: [],
  };
  try {
    const {
      username,
      password,
      business_id,
      business: businessUpdates,
    } = req.body;

    if (!username || !password || !business_id) {
      return res.status(400).json({
        success: false,
        message: "Username, password, and business_id are required",
      });
    }

    const user = await getUserByUsername(username);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid username",
      });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    const { data: currentBusiness, error: businessFetchError } = await supabase
      .from("business")
      .select("*")
      .eq("id", business_id)
      .single();

    if (businessFetchError) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch current business",
        error: businessFetchError.message,
      });
    }

    rollbackData.businessId = currentBusiness.id;
    rollbackData.businessBackup = {
      name: currentBusiness.name,
      category_id: currentBusiness.category_id,
    };

    let changeLogs = [];
    let updateBusinessData = {};

    if (businessUpdates.name && businessUpdates.name !== currentBusiness.name) {
      changeLogs.push(
        `Business name: from "${currentBusiness.name}" to "${businessUpdates.name}"`
      );
      updateBusinessData.name = businessUpdates.name;
    }

    if (businessUpdates.category_name) {
      const newCategoryId = await getCategoryId(businessUpdates.category_name);

      if (!newCategoryId) {
        return res
          .status(404)
          .json({ success: false, message: "Category not found" });
      }

      if (newCategoryId !== currentBusiness.category_id) {
        const currentCategoryName = await getCategoryName(
          currentBusiness.category_id
        );
        changeLogs.push(
          `Category: from "${currentCategoryName}" to "${businessUpdates.category_name}"`
        );
        updateBusinessData.category_id = newCategoryId;
      }
    }

    if (Object.keys(updateBusinessData).length > 0) {
      await updateBusinessRecord(business_id, updateBusinessData);
    }

    if (businessUpdates.emails && Array.isArray(businessUpdates.emails)) {
      const { data: currentEmails, error: emailFetchError } = await supabase
        .from("email")
        .select("*")
        .eq("business_id", business_id);

      if (emailFetchError) {
        await rollbackUpdate(rollbackData);
        return res.status(500).json({
          success: false,
          message: "Failed to fetch current emails",
          error: emailFetchError.message,
        });
      }

      const primaryEmails = businessUpdates.emails.filter(
        (e) => e.email_type === "Primary"
      );
      const nonPrimaryEmails = businessUpdates.emails.filter(
        (e) => e.email_type !== "Primary"
      );

      if (primaryEmails.length === 0) {
        return res
          .status(400)
          .json({ success: false, message: "Primary email is required" });
      }

      if (primaryEmails.length > 1) {
        return res.status(400).json({
          success: false,
          message: "Only one primary email is allowed",
        });
      }

      const existingPrimaryEmail = currentEmails.find(
        (e) => e.email_type === "Primary"
      );

      if (
        existingPrimaryEmail &&
        existingPrimaryEmail.email_address !== primaryEmails[0].email_address
      ) {
        rollbackData.updatedPrimaryEmailId = existingPrimaryEmail.id;
        rollbackData.previousPrimaryEmail = existingPrimaryEmail.email_address;
        await updatePrimaryEmail(
          existingPrimaryEmail.id,
          primaryEmails[0].email_address
        );
        changeLogs.push(
          `Primary email updated: from "${existingPrimaryEmail.email_address}" to "${primaryEmails[0].email_address}"`
        );
      }

      const deletedEmailsData = await deleteNonPrimaryEmails(business_id);
      rollbackData.deletedEmails = deletedEmailsData;

      const insertedEmailIds = await insertNonPrimaryEmails(
        business_id,
        nonPrimaryEmails
      );
      rollbackData.insertedEmails = insertedEmailIds;

      if (nonPrimaryEmails.length > 0) {
        nonPrimaryEmails.forEach((email) => {
          changeLogs.push(
            `Added email: "${email.email_address}" (${email.email_type})`
          );
        });
      }
    }

    if (businessUpdates.location) {
      const { data: currentLocation, error: locationFetchError } =
        await supabase
          .from("location")
          .select("*")
          .eq("id", currentBusiness.location_id)
          .single();

      if (locationFetchError) {
        await rollbackUpdate(rollbackData);
        return res.status(500).json({
          success: false,
          message: "Failed to fetch current location",
          error: locationFetchError.message,
        });
      }

      rollbackData.locationId = currentLocation.id;
      rollbackData.locationBackup = {
        line1: currentLocation.line1,
        line2: currentLocation.line2,
        line3: currentLocation.line3,
        country: currentLocation.country,
      };

      let updateLocationData = {};

      if (
        businessUpdates.location.line1 &&
        businessUpdates.location.line1 !== currentLocation.line1
      ) {
        updateLocationData.line1 = businessUpdates.location.line1;
        changeLogs.push(
          `Location line1: from "${currentLocation.line1}" to "${businessUpdates.location.line1}"`
        );
      }

      if (
        businessUpdates.location.line2 &&
        businessUpdates.location.line2 !== currentLocation.line2
      ) {
        updateLocationData.line2 = businessUpdates.location.line2;
        changeLogs.push(
          `Location line2: from "${currentLocation.line2}" to "${businessUpdates.location.line2}"`
        );
      }

      if (
        businessUpdates.location.line3 &&
        businessUpdates.location.line3 !== currentLocation.line3
      ) {
        updateLocationData.line3 = businessUpdates.location.line3;
        changeLogs.push(
          `Location line3: from "${currentLocation.line3}" to "${businessUpdates.location.line3}"`
        );
      }

      if (
        businessUpdates.location.country &&
        businessUpdates.location.country !== currentLocation.country
      ) {
        updateLocationData.country = businessUpdates.location.country;
        changeLogs.push(
          `Country: from "${currentLocation.country}" to "${businessUpdates.location.country}"`
        );
      }

      if (Object.keys(updateLocationData).length > 0) {
        await updateLocationRecord(
          currentBusiness.location_id,
          updateLocationData
        );
      }
    }

    if (businessUpdates.contacts && Array.isArray(businessUpdates.contacts)) {
      for (const contactItem of businessUpdates.contacts) {
        if (contactItem.id) {
          const { data: currentContact, error: contactFetchError } =
            await supabase
              .from("contact")
              .select("*")
              .eq("id", contactItem.id)
              .single();

          if (contactFetchError) {
            await rollbackUpdate(rollbackData);
            return res.status(500).json({
              success: false,
              message: "Failed to fetch current contact",
              error: contactFetchError.message,
            });
          }

          if (
            contactItem.number &&
            contactItem.number !== currentContact.number
          ) {
            rollbackData.updatedContacts = rollbackData.updatedContacts || [];
            rollbackData.updatedContacts.push({
              id: currentContact.id,
              previousNumber: currentContact.number,
            });
            await updateContact(contactItem.id, contactItem.number);
            changeLogs.push(
              `Contact updated: from "${currentContact.number}" to "${contactItem.number}"`
            );
          }
        } else {
          const contactError = contactValidation(contactItem.number);

          if (contactError) {
            return res
              .status(400)
              .json({ success: false, message: contactError });
          }
          const insertedId = await insertContact(
            business_id,
            contactItem.number
          );

          rollbackData.insertedContacts = rollbackData.insertedContacts || [];
          rollbackData.insertedContacts.push(insertedId);
          changeLogs.push(`Added contact: "${contactItem.number}"`);
        }
      }
    }

    if (businessUpdates.users && Array.isArray(businessUpdates.users)) {
      const rollbackBHU = await processBHUUpdate(
        business_id,
        businessUpdates.users
      );

      rollbackData.deletedBHURecords = rollbackBHU.deletedRecords || [];
      rollbackData.updatedBHURecords = rollbackBHU.updatedRecords || [];

      for (const rec of rollbackData.deletedBHURecords) {
        changeLogs.push(`Removed user with id ${rec.user_id} from business`);
      }

      for (const rec of rollbackData.updatedBHURecords) {
        changeLogs.push(`Updated user ${rec.id} type to new value`);
      }
    }

    if (changeLogs.length === 0) {
      changeLogs.push("No changes were made.");
    }

    const logDescription =
      `${user.username} made changes:\n` + changeLogs.join("\n");
    const { error: logError } = await supabase
      .from("business_update_log")
      .insert([{ user_id: user.id, description: logDescription }]);

    if (logError) {
      await rollbackUpdate(rollbackData);
      return res.status(500).json({
        success: false,
        message: "Failed to log update",
        error: logError.message,
      });
    }

    res.status(200).json({
      success: true,
      message: "Business updated successfully",
      changeLogs,
    });
  } catch (error) {
    console.error("Error updating business:", error);

    await rollbackUpdate(rollbackData);
    res.status(500).json({
      success: false,
      message: "Failed to update business",
      error: error.message,
    });
  }
};

exports.deleteBusiness = async (req, res) => {
  try {
    const { username, password, business_id } = req.body;
    if (!username || !password || !business_id) {
      return res.status(400).json({
        success: false,
        message: "Username, password, and business_id are required",
      });
    }

    const user = await getUserByUsername(username);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid username",
      });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    if (user.type !== "Owner") {
      return res.status(403).json({
        success: false,
        message: "Only owners can delete a business",
      });
    }

    const { data: businessDeleteData, error: businessDeleteError } =
      await supabase.from("business").delete().eq("id", business_id).select();

    if (businessDeleteError) throw businessDeleteError;

    const { data: locationDeleteData, error: locationDeleteError } =
      await supabase
        .from("location")
        .delete()
        .eq("id", businessDeleteData[0].location_id)
        .select();

    if (locationDeleteError) throw locationDeleteError;

    res.status(200).json({
      success: true,
      message: "Business deleted successfully",
      business_data: businessDeleteData,
      location_data: locationDeleteData,
    });
  } catch (error) {
    console.error("Error deleting business:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete business",
      error: error.message,
    });
  }
};
