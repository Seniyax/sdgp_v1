const supabase = require("../config/supabaseClient");
const bcrypt = require("bcrypt");

exports.getOneBusiness = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required",
      });
    }

    const { data, error } = await supabase
      .from("business")
      .select("*")
      .eq("username", username)
      .single();

    if (error || !data) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    const passwordMatch = await bcrypt.compare(password, data.password);
    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    res.status(200).json({
      success: true,
      data: data,
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

exports.getAllBusiness = async (req, res) => {
  try {
    const { data, error } = await supabase.from("business").select("*");

    if (error) {
      throw error;
    }

    res.status(200).json({
      success: true,
      data: data,
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

exports.createBusiness = async (req, res) => {
  try {
    const { name, address, username, password, category_name } = req.body;

    if (!name || !address || !username || !password || !category_name) {
      return res.status(400).json({
        success: false,
        message: "All fields (name, address, username, password, category_name) are required",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data: categoryData, error: categoryError } = await supabase
      .from("category")
      .select("id")
      .eq("name", category_name)
      .single();

    if (categoryError) {
      throw categoryError;
    }

    if (!categoryData) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const categoryId = categoryData.id;

    const { data, error } = await supabase
      .from("business")
      .insert([
        { name, address, username, password: hashedPassword, category_id: categoryId }
      ])
      .select();

    if (error) {
      throw error;
    }

    res.status(201).json({
      success: true,
      data: data,
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
    const { id } = req.params;
    const { name, address } = req.body;

    if (!name && !address) {
      return res.status(400).json({
        success: false,
        message: "At least one field (name or address) is required to update",
      });
    }

    const { data, error } = await supabase
      .from("business")
      .update({ name, address })
      .eq("id", id)
      .select();

    if (error) {
      throw error;
    }

    res.status(200).json({
      success: true,
      data: data,
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
    const { id } = req.params;

    const { data, error } = await supabase
      .from("business")
      .delete()
      .eq("id", id);

    if (error) {
      throw error;
    }

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
