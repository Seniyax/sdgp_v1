const supabase = require("../config/supabaseClient");
require("dotenv").config();

const generateTemplate = (status, message) => {
  const homeUrl = process.env.CLIENT_ORIGIN || "/";
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Email Verification</title>
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
      status === "success" ? "Congratulations!" : "Oops!"
    }</div>
    <div class="message">${message}</div>
    <a class="btn" href="${homeUrl}">Return to Homepage</a>
    <div class="footer">${
      status === "success"
        ? "Thank you for verifying your email."
        : "Please try verifying your email again or contact support."
    }</div>
  </div>
</body>
</html>`;
};

exports.getAllEmailTypes = async (req, res) => {
  try {
    const { data, error } = await supabase.from("email_type").select("name");

    if (error) throw error;

    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Couldn't find any email types",
      });
    }

    return res.status(200).json({ success: true, data });
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
    return res.send(generateTemplate("error", "Invalid or missing token."));
  }
  const { data: user, error } = await supabase
    .from("user")
    .select("*")
    .eq("verification_token", token)
    .single();
  if (!user || error) {
    return res.send(
      generateTemplate("error", "The token provided is invalid or has expired.")
    );
  }
  const { error: updateError } = await supabase
    .from("user")
    .update({ is_verified: true, verification_token: null })
    .eq("id", user.id);
  if (updateError) {
    return res.send(
      generateTemplate(
        "error",
        "We encountered an issue verifying your email. Please try again later."
      )
    );
  }
  res.send(
    generateTemplate("success", "Your email has been successfully verified!")
  );
};

exports.verifyBusinessEmail = async (req, res) => {
  const { token } = req.query;
  if (!token) {
    return res.send(generateTemplate("error", "Invalid or missing token."));
  }
  const { data: business, error } = await supabase
    .from("business")
    .select("*")
    .eq("verification_token", token)
    .single();
  if (!business || error) {
    return res.send(
      generateTemplate("error", "The token provided is invalid or has expired.")
    );
  }
  const { error: updateError } = await supabase
    .from("business")
    .update({ is_verified: true, verification_token: null })
    .eq("id", business.id);
  if (updateError) {
    return res.send(
      generateTemplate(
        "error",
        "We encountered an issue verifying your business email. Please try again later."
      )
    );
  }
  res.send(
    generateTemplate(
      "success",
      "Your business email has been successfully verified!"
    )
  );
};

exports.verifyUserEmailBySupervisor = async (req, res) => {
  const { token } = req.query;
  if (!token) {
    return res.send(generateTemplate("error", "Invalid or missing token."));
  }
  const { data: bhu, error } = await supabase
    .from("business_has_user")
    .select("*")
    .eq("verification_token", token)
    .single();
  if (!bhu || error) {
    return res.send(
      generateTemplate("error", "The token provided is invalid or has expired.")
    );
  }
  const { error: updateError } = await supabase
    .from("business_has_user")
    .update({ is_verified: true, verification_token: null })
    .eq("id", bhu.id);
  if (updateError) {
    return res.send(
      generateTemplate(
        "error",
        "We encountered an issue verifying the relation. Please try again later."
      )
    );
  }
  res.send(
    generateTemplate(
      "success",
      "The business relation has been successfully verified!"
    )
  );
};
