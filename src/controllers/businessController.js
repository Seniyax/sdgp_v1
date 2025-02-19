const supabase = require("../config/supabaseClient");
const bcrypt = require("bcrypt");

const emailValidation = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email) ? null : "Invalid email address format";
};

const passwordValidation = (password) => {
  const minLength = 8;
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

  if (password.length < minLength) {
    return "Password must be at least 8 characters long";
  }

  return regex.test(password)
    ? null
    : "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character";
};

async function getBusinessByUsername(username) {
  const { data, error } = await supabase
    .from("business")
    .select("*")
    .eq("username", username)
    .maybeSingle();

  if (error) throw error;
  return data;
}

async function getCategoryId(categoryName) {
  const { data, error } = await supabase
    .from("category")
    .select("id")
    .eq("name", categoryName)
    .single();

  if (error) throw error;
  return data ? data.id : null;
}

async function getEmailTypeId(emailTypeName) {
  const { data, error } = await supabase
    .from("email_type")
    .select("id")
    .eq("name", emailTypeName)
    .single();

  if (error) throw error;
  return data ? data.id : null;
}

exports.getOneBusiness = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required",
      });
    }

    const business = await getBusinessByUsername(username);

    if (!business) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    const passwordMatch = await bcrypt.compare(password, business.password);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    res.status(200).json({
      success: true,
      data: business,
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
  try {
    const {
      name,
      email,
      address,
      username,
      password,
      confirm_password,
      category_name,
    } = req.body;

    if (
      !name ||
      !email ||
      !address ||
      !username ||
      !password ||
      !confirm_password ||
      !category_name
    ) {
      return res.status(400).json({
        success: false,
        message:
          "All fields (name, email, address, username, password, confirm_password, category_name) are required",
      });
    }

    const emailError = emailValidation(email);

    if (emailError) {
      return res.status(400).json({ success: false, message: emailError });
    }

    if (password !== confirm_password) {
      return res.status(400).json({
        success: false,
        message: "Password and confirm password don't match",
      });
    }

    const passwordError = passwordValidation(password);

    if (passwordError) {
      return res.status(400).json({ success: false, message: passwordError });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const categoryId = await getCategoryId(category_name);

    if (!categoryId) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const { data: businessData, error: businessError } = await supabase
      .from("business")
      .insert([
        {
          name,
          address,
          username,
          password: hashedPassword,
          category_id: categoryId,
        },
      ])
      .select();

    if (businessError) {
      return res.status(500).json({
        success: false,
        message: "Failed to insert business",
        error: businessError.message,
      });
    }

    const { data: emailData, error: emailInsertError } = await supabase
      .from("email")
      .insert([
        {
          email_address: email,
          business_id: businessData[0].id,
        },
      ])
      .select();

    if (emailInsertError) throw emailInsertError;

    res.status(201).json({
      success: true,
      business_data: businessData,
      email_data: emailData,
    });
  } catch (error) {
    console.error("Error creating business:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create business",
      error: error.message,
    });
  }
};

exports.updateBusiness = async (req, res) => {
  try {
    const {
      username,
      name,
      emailsDetails,
      address,
      new_username,
      password,
      category_name,
    } = req.body;

    if (!username) {
      return res.status(400).json({
        success: false,
        message: "Username is required",
      });
    }

    if (
      !name &&
      !emailsDetails &&
      !address &&
      !new_username &&
      !password &&
      !category_name
    ) {
      return res.status(400).json({
        success: false,
        message:
          "At least one field (name, address, new_username, password, or category_name) is required to update",
      });
    }

    const existingBusiness = await getBusinessByUsername(username);
    if (!existingBusiness) {
      return res.status(404).json({
        success: false,
        message: "Business not found",
      });
    }
    const businessId = existingBusiness.id;

    const updateBusinessData = {};
    const updateEmailData = [];
    const createEmailData = [];

    if (name) updateBusinessData.name = name;
    if (address) updateBusinessData.address = address;

    if (password) {
      updateBusinessData.password = await bcrypt.hash(password, 10);
    }

    if (new_username && new_username !== username) {
      const newUsernameExists = await getBusinessByUsername(new_username);

      if (newUsernameExists) {
        return res.status(400).json({
          success: false,
          message: "Username already exists",
        });
      }

      updateBusinessData.username = new_username;
    }

    if (category_name) {
      const categoryId = await getCategoryId(category_name);

      if (!categoryId) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }

      updateBusinessData.category_id = categoryId;
    }

    if (emailsDetails && Array.isArray(emailsDetails)) {
      for (let i = 0; i < emailsDetails.length; i++) {
        const { email_address: emailAddress, email_type: emailType } =
          emailsDetails[i];
        const emailErr = emailValidation(emailAddress);

        if (emailErr) {
          return res.status(400).json({ success: false, message: emailErr });
        }

        const emailTypeId = await getEmailTypeId(emailType);

        if (!emailTypeId) {
          return res.status(404).json({
            success: false,
            message: "Email type not found",
          });
        }

        const { data: existingEmail, error: emailError } = await supabase
          .from("email")
          .select("*")
          .eq("email_type_id", emailTypeId)
          .eq("business_id", businessId)
          .maybeSingle();

        if (emailError) throw emailError;

        if (existingEmail) {
          updateEmailData.push({
            id: existingEmail.id,
            email_address: emailAddress,
            email_type_id: emailTypeId,
          });
        } else {
          createEmailData.push({
            email_address: emailAddress,
            email_type_id: emailTypeId,
            business_id: businessId,
          });
        }
      }
    }

    let updatedBusiness;

    if (Object.keys(updateBusinessData).length > 0) {
      const { data: businessUpdateData, error: businessUpdateError } =
        await supabase
          .from("business")
          .update(updateBusinessData)
          .eq("id", businessId)
          .select();

      if (businessUpdateError) {
        return res.status(500).json({
          success: false,
          message: "Failed to update business",
          error: businessUpdateError.message,
        });
      }
      updatedBusiness = businessUpdateData;
    } else {
      const { data: businessCurrent, error: businessCurrentError } =
        await supabase.from("business").select().eq("id", businessId).single();

      if (businessCurrentError) throw businessCurrentError;
      updatedBusiness = businessCurrent;
    }

    const updatedEmails = [];

    for (let i = 0; i < updateEmailData.length; i++) {
      const emailUpdate = updateEmailData[i];
      const { data: emailUpdated, error: emailUpdateError } = await supabase
        .from("email")
        .update({
          email_address: emailUpdate.email_address,
          email_type_id: emailUpdate.email_type_id,
        })
        .eq("id", emailUpdate.id)
        .select();

      if (emailUpdateError) {
        return res.status(500).json({
          success: false,
          message: "Failed to update email",
          error: emailUpdateError.message,
        });
      }
      updatedEmails.push(...emailUpdated);
    }

    const insertedEmails = [];

    for (let i = 0; i < createEmailData.length; i++) {
      const emailInsert = createEmailData[i];
      const { data: emailInserted, error: emailInsertError } = await supabase
        .from("email")
        .insert(emailInsert)
        .select();

      if (emailInsertError) {
        return res.status(500).json({
          success: false,
          message: "Failed to insert email",
          error: emailInsertError.message,
        });
      }
      insertedEmails.push(...emailInserted);
    }

    res.status(200).json({
      success: true,
      business_data: updatedBusiness,
      updated_emails: updatedEmails,
      inserted_emails: insertedEmails,
    });
  } catch (error) {
    console.error("Error updating business:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update business",
      error: error.message,
    });
  }
};

exports.deleteBusiness = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required",
      });
    }

    const business = await getBusinessByUsername(username);

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Business not found",
      });
    }

    const passwordMatches = await bcrypt.compare(password, business.password);

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    const { data, error } = await supabase
      .from("business")
      .delete()
      .eq("username", username);

    if (error) throw error;

    res.status(200).json({
      success: true,
      message: "Business deleted successfully",
      data: data,
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

    return res.status(200).json({
      success: true,
      data: data,
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
