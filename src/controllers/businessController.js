require("dotenv").config();
const {
  getBusinessesMinimal,
  createBusinessRecord,
  updateBusinessRecord,
  getOneBusiness,
  deleteBusiness,
} = require("../models/business");
const { getCategoryId, getCategoryName } = require("../models/category");
const {
  getLocationDetails,
  createLocation,
  updateLocationRecord,
  deleteLocation,
} = require("../models/location");
const {
  buildEmails,
  createPrimaryEmail,
  updatePrimaryEmail,
  deleteEmail,
  insertNonPrimaryEmails,
  getEmailsByBusiness,
  validateEmail,
} = require("../models/email");
const {
  getContacts,
  createContacts,
  deleteContacts,
  validateContact,
} = require("../models/contact");
const {
  createBusinessRelation,
  createBusinessRelations,
  getUserRelationsByBusiness,
  deleteBusinessRelations,
} = require("../models/businessHasUser");
const { insertBusinessUpdateLog } = require("../models/businessUpdateLog");
const { getUserByUsername } = require("../models/user");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

async function sendVerificationEmail(email, token) {
  const verificationLink = `http://localhost:3000/api/email/verify-business?token=${token}`;
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify Your Email Address",
    html: `
      <html>
        <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
          <div style="max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 5px; text-align: center;">
            <h2 style="color: #333;">Welcome to SlotZi!</h2>
            <p style="color: #555;">Thank you for registering. Please click the button below to verify your email address as a business email.</p>
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
    const businesses = await getBusinessesMinimal();
    if (!businesses || businesses.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No businesses found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Businesses fetched successfully",
      data: businesses,
    });
  } catch (error) {
    console.error("Error fetching businesses:", error.message);
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
    const business = await getOneBusiness(business_id);
    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Business not found",
      });
    }
    const location = await getLocationDetails(business_id);
    const emails = await getEmailsByBusiness(business_id);
    const contacts = await getContacts(business_id);
    const business_user_relations = await getUserRelationsByBusiness(
      business_id
    );

    res.status(200).json({
      success: true,
      message: "Business fetched successfully",
      data: {
        business,
        location,
        emails,
        contacts,
        business_user_relations,
      },
    });
  } catch (error) {
    console.error("Error fetching business:", error.message);
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
      return res.status(401).json({
        success: false,
        message: "Invalid username",
      });
    }
    const businessEmailError = validateEmail(email_address);
    if (businessEmailError) {
      return res.status(400).json({
        success: false,
        message: businessEmailError,
      });
    }
    for (let contact of contacts) {
      const contactError = validateContact(contact);
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
    await sendVerificationEmail(email_address, verificationToken);
    const bHURecord = await createBusinessRelation({
      user_id: owner.id,
      business_id: businessRecord.id,
      type: "Owner",
      supervisor_id: owner.id,
    });
    await insertBusinessUpdateLog(
      businessRecord.id,
      owner.id,
      "Business created"
    );
    res.status(201).json({
      success: true,
      message: "Business created successfully",
      data: {
        business: businessRecord,
        location: loc,
        email: emailRecord,
        contacts: contactsRecord,
        business_user_relation: bHURecord,
      },
    });
  } catch (error) {
    console.error("Error creating business:", error.message);
    if (rollbackData.businessId) {
      await deleteBusiness(rollbackData.businessId);
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
    businessBackup: null,
    emailsBackup: null,
    locationBackup: null,
    contactsBackup: null,
    userRelationsBackup: null,
  };
  let changeLogs = [];
  let updateBusinessData = {};
  let currentBusiness = null;

  try {
    const { business_id, username, updates } = req.body;
    if (!business_id) {
      return res.status(400).json({
        success: false,
        message: "Business ID is required",
      });
    }
    const supervisor = await getUserByUsername(username);
    if (!supervisor) {
      return res.status(401).json({
        success: false,
        message: "Invalid username",
      });
    }

    currentBusiness = await getOneBusiness(business_id);
    if (!currentBusiness) {
      return res.status(404).json({
        success: false,
        message: "Business not found",
      });
    }

    rollbackData.businessBackup = {
      name: currentBusiness.name,
      category_id: currentBusiness.category_id,
    };
    rollbackData.emailsBackup = await getEmailsByBusiness(business_id);
    rollbackData.locationBackup = await getLocationDetails(
      currentBusiness.location_id
    );
    rollbackData.contactsBackup = await getContacts(business_id);
    rollbackData.userRelationsBackup = await getUserRelationsByBusiness(
      business_id
    );

    if (updates.name && updates.name !== currentBusiness.name) {
      changeLogs.push(
        `Business name changed from "${currentBusiness.name}" to "${updates.name}"`
      );
      updateBusinessData.name = updates.name;
    }

    if (updates.category_name) {
      const newCategoryId = await getCategoryId(updates.category_name);
      if (!newCategoryId) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }
      if (newCategoryId !== currentBusiness.category_id) {
        const currentCategoryName = await getCategoryName(
          currentBusiness.category_id
        );
        changeLogs.push(
          `Category changed from "${currentCategoryName}" to "${updates.category_name}"`
        );
        updateBusinessData.category_id = newCategoryId;
      }
    }

    if (Object.keys(updateBusinessData).length > 0) {
      await updateBusinessRecord(business_id, updateBusinessData);
    }

    if (updates.emails) {
      const currentEmails = await buildEmails(business_id);
      let nonPrimaryEmailsUpdates = [];
      for (const updateEmail of updates.emails) {
        if (updateEmail.email_type === "Primary") {
          const primaryEmail = currentEmails.find(
            (email) => email.email_type === "Primary"
          );
          if (
            primaryEmail &&
            updateEmail.email_address !== primaryEmail.email_address
          ) {
            await updatePrimaryEmail(
              primaryEmail.email_id,
              updateEmail.email_address
            );
            changeLogs.push(
              `Primary email updated from "${primaryEmail.email_address}" to "${updateEmail.email_address}"`
            );
            const verificationToken = crypto.randomBytes(32).toString("hex");
            await updateBusinessRecord(business_id, {
              token: verificationToken,
            });
            await sendVerificationEmail(
              updateEmail.email_address,
              verificationToken
            );
          }
        } else {
          const nonPrimaryEmail = currentEmails.find(
            (email) => email.email_type === updateEmail.email_type
          );
          if (nonPrimaryEmail) {
            if (updateEmail.email_address !== nonPrimaryEmail.email_address) {
              nonPrimaryEmailsUpdates.push({
                id: nonPrimaryEmail.id,
                email_address: updateEmail.email_address,
              });
              changeLogs.push(
                `Non-primary email (type ${updateEmail.email_type}) updated from "${nonPrimaryEmail.email_address}" to "${updateEmail.email_address}"`
              );
            } else {
              await deleteEmail(business_id, nonPrimaryEmail.id);
            }
          }
        }
      }
      if (nonPrimaryEmailsUpdates.length > 0) {
        await insertNonPrimaryEmails(business_id, nonPrimaryEmailsUpdates);
      }
    }

    if (updates.location) {
      await updateLocationRecord(currentBusiness.location_id, updates.location);
      changeLogs.push("Location updated");
    }

    if (updates.contacts) {
      await deleteContacts(business_id);
      await createContacts(business_id, updates.contacts);
      changeLogs.push("Contacts updated");
    }

    if (updates.user_relations) {
      await deleteBusinessRelations(business_id);
      await createBusinessRelations(
        updates.user_relations,
        business_id,
        supervisor.id
      );
      changeLogs.push("Users updated");
    }

    if (changeLogs.length === 0) {
      changeLogs.push("No changes were made.");
    }
    const logDescription = "Business updated:\n" + changeLogs.join("\n");
    console.log("hello");

    await insertBusinessUpdateLog(
      currentBusiness.owner_id || currentBusiness.id,
      supervisor.id,
      logDescription
    );

    res.status(200).json({
      success: true,
      message: "Business updated successfully",
      changeLogs,
    });
  } catch (error) {
    console.error("Error updating business:", error.message);

    try {
      if (rollbackData.businessBackup) {
        await updateBusinessRecord(business_id, rollbackData.businessBackup);
      }
      if (
        rollbackData.locationBackup &&
        currentBusiness &&
        currentBusiness.location_id
      ) {
        await updateLocationRecord(
          currentBusiness.location_id,
          rollbackData.locationBackup
        );
      }
      console.error("Manual rollback may be required for emails and contacts.");
    } catch (rollbackError) {
      console.error("Error during rollback:", rollbackError.message);
    }
    res.status(500).json({
      success: false,
      message: "Failed to update business, changes have been rolled back",
      error: error.message,
    });
  }
};

exports.deleteBusiness = async (req, res) => {
  try {
    const { business_id } = req.body;
    if (!business_id) {
      return res.status(400).json({
        success: false,
        message: "Business ID is required",
      });
    }
    const businessDeleteData = await deleteBusiness(business_id);
    const locationDeleteData = await deleteLocation(
      businessDeleteData[0].location_id
    );
    res.status(200).json({
      success: true,
      message: "Business deleted successfully",
      business_data: businessDeleteData,
      location_data: locationDeleteData,
    });
  } catch (error) {
    console.error("Error deleting business:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to delete business",
      error: error.message,
    });
  }
};
