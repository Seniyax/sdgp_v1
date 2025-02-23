const supabase = require("../config/supabaseClient");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// Helper: Generate a verification token
function generateVerificationToken() {
  return crypto.randomBytes(32).toString("hex");
}

// Helper: Get user by username (from "user" table)
async function getUserByUsername(username) {
  const { data, error } = await supabase
    .from("user")
    .select("*")
    .eq("username", username)
    .maybeSingle();
  if (error) throw error;
  return data;
}

// Helper: Send a verification email for business relation verification
async function sendVerificationEmail(email, token) {
  const verificationLink = `http://localhost:3000/api/bhu/verify?token=${token}`;
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "uvindu.dev.slotzi@gmail.com",
      pass: "your-email-password", // Replace with your actual password or use environment variables
    },
  });
  const mailOptions = {
    from: "uvindu.dev.slotzi@gmail.com",
    to: email,
    subject: "Verify Your Business Relation",
    html: `
      <html>
        <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
          <div style="max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 5px; text-align: center;">
            <h2 style="color: #333;">New Business Relation Verification</h2>
            <p style="color: #555;">A new relation request has been made for your business. Please click the button below to verify this relation.</p>
            <a href="${verificationLink}" 
               style="display: inline-block; padding: 10px 20px; margin: 20px 0; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">
              Verify Relation
            </a>
            <p style="color: #888; font-size: 12px;">If you did not expect this, please contact support immediately.</p>
          </div>
        </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
}

// Helper: Generate a custom HTML template for BHU verification response
function generateBHUVerificationTemplate(status, message) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Business Relation Verification</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
  <style>
    body {
      margin: 0;
      padding: 0;
      background: linear-gradient(135deg, #667eea, #764ba2);
      font-family: 'Roboto', sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
      color: #444;
    }
    .container {
      background-color: #fff;
      padding: 40px 30px 30px;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
      text-align: center;
      width: 90%;
      max-width: 500px;
      position: relative;
    }
    .accent-bar {
      position: absolute;
      top: 0;
      left: 0;
      height: 15px;
      width: 100%;
      border-top-left-radius: 12px;
      border-top-right-radius: 12px;
      background-color: ${status === "success" ? "#28a745" : "#dc3545"};
    }
    .header {
      font-size: 2rem;
      font-weight: 700;
      margin-top: 20px;
      margin-bottom: 20px;
      color: #333;
    }
    .message {
      font-size: 1.2rem;
      margin-bottom: 30px;
      color: #666;
    }
    .btn {
      display: inline-block;
      text-decoration: none;
      background-color: #007bff;
      color: #fff;
      padding: 12px 25px;
      border-radius: 6px;
      font-weight: 500;
      transition: background-color 0.3s ease;
    }
    .btn:hover {
      background-color: #0056b3;
    }
    .footer {
      margin-top: 20px;
      font-size: 0.9rem;
      color: #777;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="accent-bar"></div>
    <div class="header">${
      status === "success" ? "Relation Verified!" : "Verification Failed"
    }</div>
    <div class="message">${message}</div>
    <a class="btn" href="/">Return to Dashboard</a>
    <div class="footer">${
      status === "success"
        ? "Your business relation is now verified."
        : "Please try again later or contact support."
    }</div>
  </div>
</body>
</html>`;
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

exports.verifyBusinessRelation = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) {
      return res.send(
        generateBHUVerificationTemplate("error", "Missing verification token.")
      );
    }
    const { data: bhuData, error: bhuError } = await supabase
      .from("business_has_user")
      .select("*")
      .eq("verification_token", token)
      .single();
    if (bhuError || !bhuData) {
      return res.send(
        generateBHUVerificationTemplate(
          "error",
          "Invalid or expired verification token."
        )
      );
    }
    const { error: updateError } = await supabase
      .from("business_has_user")
      .update({ is_verified: true, verification_token: null })
      .eq("id", bhuData.id);
    if (updateError) {
      return res.send(
        generateBHUVerificationTemplate(
          "error",
          "Verification failed. Please try again later."
        )
      );
    }
    return res.send(
      generateBHUVerificationTemplate(
        "success",
        "Business relation verified successfully!"
      )
    );
  } catch (error) {
    console.error("Error verifying business relation:", error.message);
    return res.send(
      generateBHUVerificationTemplate(
        "error",
        "An error occurred during verification."
      )
    );
  }
};
