const supabase = require("../config/supabaseClient");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

async function getUserByUsername(username) {
  const { data, error } = await supabase
    .from("user")
    .select("*")
    .eq("username", username)
    .maybeSingle();

  if (error) throw error;
  return data;
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

exports.createBusinessRelation = async (req, res) => {
  try {
    const { business_id, username, type, supervisor_id } = req.body;

    if (!business_id || !username || !type || !supervisor_id) {
      return res.status(400).json({
        success: false,
        message: "business_id, username, type, and supervisor_id are required",
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

    const verificationToken = crypto.randomBytes(32).toString("hex");

    const { data: bhuData, error: bhuError } = await supabase
      .from("business_has_user")
      .insert([
        {
          user_id: user.id,
          business_id,
          type,
          supervisor_id,
          verification_token: verificationToken,
          is_verified: false,
        },
      ])
      .select();
    if (bhuError) throw bhuError;
    if (!bhuData || bhuData.length === 0) {
      return res.status(500).json({
        success: false,
        message: "Failed to create business relation",
      });
    }

    const { data: supervisorData, error: supervisorError } = await supabase
      .from("user")
      .select("email, username")
      .eq("id", supervisor_id)
      .maybeSingle();
    if (supervisorError) throw supervisorError;
    if (!supervisorData) {
      return res.status(404).json({
        success: false,
        message: "Supervisor not found",
      });
    }

    await sendVerificationEmail(supervisorData.email, verificationToken);

    return res.status(201).json({
      success: true,
      message:
        "Business relation created successfully; verification email sent to supervisor",
      data: bhuData[0],
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

    const { data: bhuData, error: bhuError } = await supabase
      .from("business_has_user")
      .select("*")
      .eq("user_id", user.id);
    if (bhuError) throw bhuError;
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

exports.getUserRelations = async (req, res) => {
  try {
    const { business_id } = req.body;
    if (!business_id) {
      return res.status(400).json({
        success: false,
        message: "Business ID is required",
      });
    }

    const { data: bhuData, error: bhuError } = await supabase
      .from("business_has_user")
      .select("*")
      .eq("business_id", business_id);
    if (bhuError) throw bhuError;
    if (!bhuData || bhuData.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No user relations found for this business",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User relations fetched successfully",
      data: bhuData,
    });
  } catch (error) {
    console.error("Error fetching user relations:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user relations",
      error: error.message,
    });
  }
};
