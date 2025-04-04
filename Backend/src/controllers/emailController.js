require("dotenv").config();
const nodemailer = require("nodemailer");
const { getAllEmailTypes } = require("../models/emailType");
const {
  verifyUserEmail,
  setPasswordResetTokenToReady,
  getUserByPasswordResetToken,
} = require("../models/user");
const { verifyBusinessEmail } = require("../models/business");
const { verifyBusinessRelationByToken } = require("../models/businessHasUser");

const emailValidation = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email) ? null : "Invalid email address format";
};

const generateTemplate = (status, message, templateType = "verification") => {
  let title, header, footer, btnText, btnHref;
  if (templateType === "reset-password") {
    title = "Reset Password";
    header = status === "success" ? "" : "Something went wrong!";
    footer =
      status === "success"
        ? ""
        : "Please try resetting your password again or contact support.";
    btnText = "Return to Sign In";
    btnHref = "http://localhost:5173/sign-in";
  } else {
    title = "Email Verification";
    header = status === "success" ? "Congratulations!" : "Oops!";
    footer =
      status === "success"
        ? "Thank you for verifying your email."
        : "Please try verifying your email again or contact support.";
    btnText = "Return to Homepage";
    btnHref = "http://localhost:5173/";
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="icon" type="image/png" href="/WebFrontend/public/favicon.ico">
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
    ${header ? `<div class="header">${header}</div>` : ""}
    <div class="message">${message}</div>
    <a class="btn" href="${btnHref}">${btnText}</a>
    ${footer ? `<div class="footer">${footer}</div>` : ""}
  </div>
</body>
</html>`;
};

function buildEmailTemplate(title, message) {
  return `
    <html>
      <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 5px; text-align: center;">
          <h2 style="color: #333;">${title}</h2>
          <p style="color: #555;">${message}</p>
          <p style="color: #888; font-size: 12px;">Please review the details above and respond as needed.</p>
          <p style="color: #888; font-size: 12px;">Thanks,<br>The SlotZi Team</p>
        </div>
      </body>
    </html>
  `;
}

exports.getAllEmailTypes = async (req, res) => {
  try {
    const data = await getAllEmailTypes();
    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Couldn't find any email types",
      });
    }
    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Error fetching email types:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching email types",
      error: error.message,
    });
  }
};

exports.verifyUserEmail = async (req, res) => {
  const { token } = req.query;
  if (!token) {
    return res.send(
      generateTemplate("error", "Invalid or missing token.", "verification")
    );
  }
  try {
    await verifyUserEmail(token);
    res.send(
      generateTemplate(
        "success",
        "Your email has been successfully verified!",
        "verification"
      )
    );
  } catch (error) {
    console.error("Error verifying user email:", error.message);
    res.send(
      generateTemplate(
        "error",
        error.message || "The token provided is invalid or has expired.",
        "verification"
      )
    );
  }
};

exports.verifyBusinessEmail = async (req, res) => {
  const { token } = req.query;
  if (!token) {
    return res.send(
      generateTemplate("error", "Invalid or missing token.", "verification")
    );
  }
  try {
    await verifyBusinessEmail(token);
    res.send(
      generateTemplate(
        "success",
        "Your business email has been successfully verified!",
        "verification"
      )
    );
  } catch (error) {
    console.error("Error verifying business email:", error.message);
    res.send(
      generateTemplate(
        "error",
        error.message || "The token provided is invalid or has expired.",
        "verification"
      )
    );
  }
};

exports.verifyUserEmailBySupervisor = async (req, res) => {
  const { token } = req.query;
  if (!token) {
    return res.send(
      generateTemplate("error", "Invalid or missing token.", "verification")
    );
  }
  try {
    await verifyBusinessRelationByToken(token);
    res.send(
      generateTemplate(
        "success",
        "The business relation has been successfully verified!",
        "verification"
      )
    );
  } catch (error) {
    console.error("Error verifying business relation:", error.message);
    res.send(
      generateTemplate(
        "error",
        error.message || "The token provided is invalid or has expired.",
        "verification"
      )
    );
  }
};

exports.forgotPassword = async (req, res) => {
  const { token } = req.query;
  if (!token) {
    return res.send(
      generateTemplate("error", "Invalid or missing token.", "reset-password")
    );
  }
  try {
    const user = await getUserByPasswordResetToken(token);
    if (!user) {
      return res.send(
        generateTemplate("error", "Invalid or expired token.", "reset-password")
      );
    }
    await setPasswordResetTokenToReady(token);
    res.redirect(
      `http://localhost:5173/forgot-password?ready=true&email=${encodeURIComponent(
        user.email
      )}`
    );
  } catch (error) {
    console.error("Error updating password reset token:", error.message);
    return res.send(
      generateTemplate(
        "error",
        error.message || "The token provided is invalid or has expired.",
        "reset-password"
      )
    );
  }
};

exports.sendSupportEmail = async (req, res) => {
  const { name, email, content } = req.body;
  if (!name || !email || !content) {
    return res.status(400).json({
      success: false,
      message: "Name, email address, and email content are required",
    });
  }
  const emailValidationError = emailValidation(email);
  if (emailValidationError) {
    return res.status(400).json({
      success: false,
      message: emailValidationError,
    });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const emailTitle = "New Support Email Received";
    const emailMessage = `
      You have received a new support email from:
      <br><br>
      <strong>Name:</strong> ${name}<br>
      <strong>Email:</strong> ${email}<br><br>
      <strong>Message:</strong><br>
      ${content}
    `;
    const htmlContent = buildEmailTemplate(emailTitle, emailMessage);

    const mailOptions = {
      from: `"SlotZi Support" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: "New Support Email Received",
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);

    return res.status(200).json({
      success: true,
      message: "Support email sent successfully",
    });
  } catch (error) {
    console.error("Error occurred while sending the email:", error.message);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
