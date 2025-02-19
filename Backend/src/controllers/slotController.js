const supabase = require("../config/supabaseClient");
const bcrypt = require("bcrypt");

exports.getOneSlot = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Slot id is required",
      });
    }

    const { data, error } = await supabase
      .from("slot")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      return res.status(401).json({
        success: false,
        message: "Invalid slot id",
      });
    }

    res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.error("Error fetching slot:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch slot",
      error: error.message,
    });
  }
};

exports.getAllSlots = async (req, res) => {
  try {
    const { data, error } = await supabase.from("slot").select("*");

    if (error) {
      throw error;
    }

    res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.error("Error fetching slot:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch slot",
      error: error.message,
    });
  }
};

exports.createSlot = async (req, res) => {
  try {
    const {
      business_username,
      start_time,
      end_time,
      status,
      capacity,
      priority_name,
    } = req.body;

    if (
      !business_username ||
      !start_time ||
      !end_time ||
      !status ||
      !capacity ||
      !priority_name
    ) {
      return res.status(400).json({
        success: false,
        message:
          "All fields (business username, start time, end time, status, capacity, priority,) are required",
      });
    }

    const { data: businessData, error: businessError } = await supabase
      .from("business")
      .select("id")
      .eq("username", business_username)
      .single();

    if (businessError) {
      throw businessError;
    }

    if (!businessData) {
      return res.status(404).json({
        success: false,
        message: "Business not found",
      });
    }

    const businessId = businessData.id;

    const { data: priorityData, error: priorityError } = await supabase
      .from("priority")
      .select("id")
      .eq("name", priority_name)
      .single();

    if (priorityError) {
      throw priorityError;
    }

    if (!priorityData) {
      return res.status(404).json({
        success: false,
        message: "Priority not found",
      });
    }

    const priorityId = priorityData.id;

    const { data, error } = await supabase
      .from("slot")
      .insert([
        {
          business_id: businessId,
          start_time,
          end_time,
          status,
          capacity,
          priority_id: priorityId,
        },
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
    console.error("Error creating slot:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create slot",
      error: error.message,
    });
  }
};

exports.updateSlot = async (req, res) => {
  try {
    const { id } = req.params;
    const { start_time, end_time, status, capacity, priority_name } = req.body;

    if (!start_time && !end_time && !status && !capacity && !priority_name) {
      return res.status(400).json({
        success: false,
        message:
          "At least one fields (start time, end time, status, capacity, priority,) are required",
      });
    }

    const updateData = {};
    if (start_time) updateData.start_time = start_time;
    if (end_time) updateData.end_time = end_time;
    if (status) updateData.status = status;
    if (capacity) updateData.capacity = capacity;

    if (priority_name) {
      const { data: priorityData, error: priorityError } = await supabase
        .from("priority")
        .select("id")
        .eq("name", priority_name)
        .single();

      if (priorityError) {
        throw priorityError;
      }

      if (!priorityData) {
        return res.status(404).json({
          success: false,
          message: "Priority not found",
        });
      }

      updateData.priority_id = priorityData.id;
    }

    const { data, error } = await supabase
      .from("slot")
      .update(updateData)
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
    console.error("Error updating slot:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update slot",
      error: error.message,
    });
  }
};

exports.deleteSlot = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase.from("slot").delete().eq("id", id);

    if (error) {
      throw error;
    }

    res.status(200).json({
      success: true,
      message: "Slot deleted successfully",
      data: data,
    });
  } catch (error) {
    console.error("Error deleting slot:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete slot",
      error: error.message,
    });
  }
};
