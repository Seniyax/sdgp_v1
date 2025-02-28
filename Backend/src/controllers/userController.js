require("dotenv").config();
const {
  getUserByUsername,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require("../models/user");
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

const passwordValidation = (password) => {
  const minLength = 8;
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
  if (password.length < minLength)
    return "Password must be at least 8 characters long";
  return regex.test(password)
    ? null
    : "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character";
};

async function sendVerificationEmail(email, token) {
  const verificationLink = `http://localhost:3000/api/email/verify-user?token=${token}`;
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

/* GET /api/user/getOneUser */
exports.getOneUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required",
      });
    }
    const user = await getUserByUsername(username);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error fetching user", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user",
      error: error.message,
    });
  }
};

exports.getOneUserById = async (req, res) => {
  try {
    const { user_id } = req.query;
    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: "User id is required",
      });
    }
    const user = await getUserById(user_id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error fetching user", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user",
      error: error.message,
    });
  }
};

exports.createUser = async (req, res) => {
  try {
    const {
      name,
      nic,
      email,
      address,
      contact,
      username,
      password,
      confirm_password: confirmPassword,
    } = req.body;
    console.log("hello");
    if (
      !name ||
      !nic ||
      !email ||
      !address ||
      !contact ||
      !username ||
      !password ||
      !confirmPassword
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields of user details are required",
      });
    }
    const emailValidationError = emailValidation(email);
    if (emailValidationError) {
      return res.status(400).json({
        success: false,
        message: emailValidationError,
      });
    }
    const { data: existingUserData, error: existingUserError } =
      await require("../config/supabaseClient")
        .from("user")
        .select("*")
        .eq("email", email)
        .maybeSingle();
    if (existingUserError) throw existingUserError;
    if (existingUserData) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and confirm password don't match",
      });
    }
    const passwordValidationError = passwordValidation(password);
    if (passwordValidationError) {
      return res.status(400).json({
        success: false,
        message: passwordValidationError,
      });
    }
    if (await getUserByUsername(username)) {
      return res.status(409).json({
        success: false,
        message: "Username is already taken",
      });
    }
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await createUser({
      name,
      nic,
      email,
      address,
      contact,
      username,
      password: hashedPassword,
      verification_token: verificationToken,
    });
    await sendVerificationEmail(email, verificationToken);
    res.status(201).json({
      success: true,
      user: newUser,
    });
  } catch (error) {
    console.error("Error creating user:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to create user",
      error: error.message,
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const {
      username,
      name,
      email,
      address,
      contact,
      new_username: newUsername,
      password,
      confirm_password: confirmPassword,
    } = req.body;
    if (!username) {
      return res.status(400).json({
        success: false,
        message: "Current username is required",
      });
    }
    if (!(name || email || address || contact || newUsername || password)) {
      return res.status(400).json({
        success: false,
        message: "At least one field needs to be updated",
      });
    }
    const currentUser = await getUserByUsername(username);
    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const updateData = {};
    if (name) updateData.name = name;
    if (address) updateData.address = address;
    if (email) {
      const emailValidationError = emailValidation(email);
      if (emailValidationError) {
        return res.status(400).json({
          success: false,
          message: emailValidationError,
        });
      }
      const { data, error } = await require("../config/supabaseClient")
        .from("user")
        .select("*")
        .eq("email", email)
        .maybeSingle();
      if (error) throw error;
      if (data) {
        return res.status(409).json({
          success: false,
          message: "Email already exists",
        });
      }
      updateData.email = email;
      updateData.verification_token = crypto.randomBytes(32).toString("hex");
    }
    if (contact) {
      const contactValidationError = contactValidation(contact);
      if (contactValidationError) {
        return res.status(400).json({
          success: false,
          message: contactValidationError,
        });
      }
      updateData.contact = contact;
    }
    if (newUsername) {
      const existingUser = await getUserByUsername(newUsername);
      if (existingUser && existingUser.username !== currentUser.username) {
        return res.status(409).json({
          success: false,
          message: "New username already exists",
        });
      }
      updateData.username = newUsername;
    }
    if (password) {
      if (!confirmPassword) {
        return res.status(400).json({
          success: false,
          message: "Confirm password is required to update the password",
        });
      }
      if (password !== confirmPassword) {
        return res.status(400).json({
          success: false,
          message: "Password and confirm password don't match",
        });
      }
      const passwordValidationError = passwordValidation(password);
      if (passwordValidationError) {
        return res.status(400).json({
          success: false,
          message: passwordValidationError,
        });
      }
      updateData.password = await bcrypt.hash(password, 10);
    }
    const updatedUser = await updateUser(username, updateData);
    if (updateData.email && updateData.verification_token) {
      await sendVerificationEmail(
        updateData.email,
        updateData.verification_token
      );
    }
    res.status(200).json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to update user",
      error: error.message,
    });
  }
};

exports.deleteUser = async (req, res) => {
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
    const deletedData = await deleteUser(username);
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: deletedData,
    });
  } catch (error) {
    console.error("Error deleting user", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to delete user",
      error: error.message,
    });
  }
};
