require("dotenv").config();
const {
  getUserByUsername,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserByEmail,
  updateUserPassword,
  setPasswordResetToken,
  getUserByPasswordResetToken,
  uploadProfilePicture,
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

const dobValidation = (dob) => {
  const regex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
  if (!regex.test(dob)) {
    return "Invalid date of birth format. Expected format: YYYY-MM-DD";
  }
  const date = new Date(dob);
  if (isNaN(date.getTime())) {
    return "Invalid date provided.";
  }
  const [year, month, day] = dob.split("-").map(Number);
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() + 1 !== month || // getUTCMonth() returns 0-11
    date.getUTCDate() !== day
  ) {
    return "Invalid date provided.";
  }
  const now = new Date();
  if (date > now) {
    return "Date of birth cannot be in the future.";
  }

  return null;
};

function buildEmailTemplate(title, message, link, buttonText, buttonColor) {
  return `
    <html>
      <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 5px; text-align: center;">
          <h2 style="color: #333;">${title}</h2>
          <p style="color: #555;">${message}</p>
          <a href="${link}" 
             style="display: inline-block; padding: 10px 20px; margin: 20px 0; background-color: ${buttonColor}; color: white; text-decoration: none; border-radius: 5px;">
            ${buttonText}
          </a>
          <p style="color: #888; font-size: 12px;">If you did not request this, please ignore this email.</p>
          <p style="color: #888; font-size: 12px;">Thanks,<br>The SlotZi Team</p>
        </div>
      </body>
    </html>
  `;
}

async function sendEmail(email, token, type) {
  const templates = {
    verification: {
      link: `http://localhost:3000/api/email/verify-user?token=${token}`,
      subject: "Verify Your Email Address",
      title: "Welcome to SlotZi!",
      message:
        "Thank you for registering. Please click the button below to verify your email address.",
      buttonText: "Verify Email",
      buttonColor: "#4CAF50",
    },
    "reset-password": {
      link: `http://localhost:3000/api/email/forgot-password?token=${token}`,
      subject: "Password Reset Request",
      title: "Reset Your Password",
      message:
        "You requested a password reset. Please click the button below to reset your password.",
      buttonText: "Reset Password",
      buttonColor: "#FF5722",
    },
  };

  const template = templates[type];
  if (!template) {
    throw new Error("Invalid email type provided.");
  }

  const { link, subject, title, message, buttonText, buttonColor } = template;
  const html = buildEmailTemplate(
    title,
    message,
    link,
    buttonText,
    buttonColor
  );

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
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
}

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
    if (!user.is_verified) {
      return res.status(401).json({
        success: false,
        message: `Check ${user.email} for the email confirmation. If you don't see the email, please check your spam or junk folder.`,
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
    const contactValidationError = contactValidation(contact);
    if (contactValidationError) {
      return res.status(400).json({
        success: false,
        message: contactValidationError,
      });
    }
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
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
    await sendEmail(email, verificationToken, "verification");
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

exports.updateUser = [
  async (req, res) => {
    try {
      const {
        username,
        name,
        new_email,
        address,
        contact,
        new_username,
        nic,
        bio,
        dob,
        twitter,
        linkedin,
        facebook,
        gender,
        marital_status,
      } = req.body;

      if (!username) {
        return res.status(400).json({
          success: false,
          message: "Current username is required",
        });
      }

      if (
        !(
          name ||
          new_email ||
          address ||
          contact ||
          new_username ||
          req.file ||
          nic ||
          bio ||
          dob ||
          twitter ||
          linkedin ||
          facebook ||
          gender ||
          marital_status
        )
      ) {
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

      if (new_email) {
        const emailValidationError = emailValidation(new_email);
        if (emailValidationError) {
          return res.status(400).json({
            success: false,
            message: emailValidationError,
          });
        }
        const existingUser = await getUserByEmail(new_email);
        if (existingUser) {
          return res.status(409).json({
            success: false,
            message: "Email already exists",
          });
        }
      }

      if (contact) {
        const contactValidationError = contactValidation(dob);
        if (contactValidationError) {
          return res.status(400).json({
            success: false,
            message: contactValidationError,
          });
        }
      }

      if (new_username) {
        if (await getUserByUsername(new_username)) {
          return res.status(409).json({
            success: false,
            message: "Username is already taken",
          });
        }
      }
      
      if (dob) {
        const dobValidationError = dobValidation(contact);
        if (dobValidationError) {
          return res.status(400).json({
            success: false,
            message: dobValidationError,
          });
        }
      }

      const updateData = {};
      if (name) updateData.name = name;
      if (address) updateData.address = address;
      if (new_email) {
        updateData.email = new_email;
        updateData.verification_token = crypto.randomBytes(32).toString("hex");
      }
      if (contact) updateData.contact = contact;
      if (new_username) updateData.username = new_username;

      if (nic) updateData.nic = nic;
      if (bio) updateData.bio = bio;
      if (dob) updateData.dob = dob;
      if (twitter) updateData.twitter = twitter;
      if (linkedin) updateData.linkedin = linkedin;
      if (facebook) updateData.facebook = facebook;
      if (gender) updateData.gender = gender;
      if (marital_status) updateData.marital_status = marital_status;

      if (req.file) {
        try {
          const publicURL = await uploadProfilePicture(username, req.file);
          updateData.profile_pic_url = publicURL;
        } catch (fileError) {
          console.error("Error uploading file:", fileError);
          return res.status(500).json({
            success: false,
            message: "Error uploading profile picture",
          });
        }
      }

      const updatedUser = await updateUser(username, updateData);

      if (updateData.email && updateData.verification_token) {
        await sendEmail(
          updateData.email,
          updateData.verification_token,
          "verification"
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
  },
];

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

exports.requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (
      user.password_reset_token !== null &&
      user.password_reset_token !== "Ready"
    ) {
      return res.status(409).json({
        success: false,
        message: `A reset token has already been sent to ${user.email}. Please check your email.`,
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    await setPasswordResetToken(email, resetToken);
    await sendEmail(email, resetToken, "reset-password");

    res.status(200).json({
      success: true,
      message: "Password reset email successfully sent",
    });
  } catch (error) {
    console.error("Error in password reset request:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to process request",
      error: error.message,
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, email, newPassword, confirmPassword } = req.body;
    if (!token || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    let user;
    if (token === "Ready") {
      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Email is required when token is Ready",
        });
      }
      user = await getUserByEmail(email);
      if (!user || user.password_reset_token !== "Ready") {
        return res.status(400).json({
          success: false,
          message: "Invalid or expired token",
        });
      }
    } else {
      user = await getUserByPasswordResetToken(token);
      if (!user || user.password_reset_token !== "Ready") {
        return res.status(400).json({
          success: false,
          message: "Invalid or expired token",
        });
      }
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }
    const passwordValidationError = passwordValidation(password);
    if (passwordValidationError) {
      return res.status(400).json({
        success: false,
        message: passwordValidationError,
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await updateUserPassword(user.id, hashedPassword);

    res.status(200).json({
      success: true,
      message: "Password has been reset successfully",
    });
  } catch (error) {
    console.error("Error resetting password:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to reset password",
      error: error.message,
    });
  }
};
