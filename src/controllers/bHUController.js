require("dotenv").config();
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { getUserByUsername } = require("../models/user");
const {
  createBusinessRelation,
  getBusinessRelationsByUser,
  getUserRelationsByBusiness,
  processBHUUpdate,
  buildUsersForBusiness,
} = require("../models/businessHasUser");
const { getOneBusiness } = require("../models/business");

async function sendVerificationEmail(email, token, name, businessName, type) {
  const verificationLink = `http://localhost:3000/api/email/verify-user-by-supervisor?token=${token}`;
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
    subject: "Verify Join Request",
    html: `
      <html>
        <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
          <div style="max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 5px; text-align: center;">
            <h2 style="color: red;"><b>Attention!!!</b></h2>
            <p style="color: #555;">A new business join request requires your verification.</p>
            <p style="color: #555;">${name} wants to join ${businessName} as an ${type}</p>
            <a href="${verificationLink}" 
               style="display: inline-block; padding: 10px 20px; margin: 20px 0; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">
              Verify Join Request
            </a>
            <p style="color: #888; font-size: 12px;">If you are unaware of this request, please ignore this email.</p>
          </div>
        </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
}

exports.createBusinessRelation = async (req, res) => {
  try {
    const { business_id, username, type, supervisor_username } = req.body;
    if (!business_id || !username || !type || !supervisor_username) {
      return res.status(400).json({
        success: false,
        message:
          "business_id, username, type, and supervisor_username are required",
      });
    }
    if (type === "Owner") {
      return res.status(400).json({
        success: false,
        message: "Cannot create a business relation as Owner",
      });
    }
    if (!["Admin", "Staff"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user type; allowed types: Admin, Staff",
      });
    }
    const user = await getUserByUsername(username);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const business = await getOneBusiness(business_id);
    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Business not found",
      });
    }
    const supervisor = await getUserByUsername(supervisor_username);
    if (!supervisor) {
      return res.status(404).json({
        success: false,
        message: "Supervisor not found",
      });
    }
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const bhuRecord = await createBusinessRelation({
      user_id: user.id,
      business_id,
      type,
      supervisor_id: supervisor.id,
      verification_token: verificationToken,
      is_verified: false,
    });

    await sendVerificationEmail(supervisor.email, verificationToken, user.name, business.name, type);
    return res.status(201).json({
      success: true,
      message:
        "Business relation created successfully; verification email sent to supervisor",
      data: bhuRecord,
    });
  } catch (error) {
    console.error("Error creating business relation:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to create business relation",
      error: error.message,
    });
  }
};

exports.getBusinessRelations = async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({
        success: false,
        message: "Username is required",
      });
    }

    const user = await getUserByUsername(username);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const bhuData = await getBusinessRelationsByUser(user.id);
    if (!bhuData || bhuData.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No business relations found for the user",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Business relations fetched successfully",
      data: bhuData,
    });
  } catch (error) {
    console.error("Error fetching business relations:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch business relations",
      error: error.message,
    });
  }
};
