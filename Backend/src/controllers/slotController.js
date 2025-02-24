const {
  getOneSlot,
  getAllSlots,
  createSlot,
  updateSlot,
  deleteSlot,
} = require("../models/slot");

exports.getOneSlot = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Slot id is required",
      });
    }
    const slot = await getOneSlot(id);
    if (!slot) {
      return res.status(404).json({
        success: false,
        message: "Invalid slot id",
      });
    }
    res.status(200).json({
      success: true,
      data: slot,
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
    const slots = await getAllSlots();
    res.status(200).json({
      success: true,
      data: slots,
    });
  } catch (error) {
    console.error("Error fetching slots:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch slots",
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
          "All fields (business username, start time, end time, status, capacity, priority) are required",
      });
    }
    const { data: businessData, error: businessError } = await supabase
      .from("business")
      .select("id")
      .eq("username", business_username)
      .single();
    if (businessError || !businessData) {
      return res
        .status(404)
        .json({ success: false, message: "Business not found" });
    }
    const { data: priorityData, error: priorityError } = await supabase
      .from("priority")
      .select("id")
      .eq("name", priority_name)
      .single();
    if (priorityError || !priorityData) {
      return res
        .status(404)
        .json({ success: false, message: "Priority not found" });
    }
    const newSlot = await createSlot({
      business_id: businessData.id,
      start_time,
      end_time,
      status,
      capacity,
      priority_id: priorityData.id,
    });
    res.status(201).json({
      success: true,
      data: newSlot,
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
          "At least one field (start time, end time, status, capacity, priority) is required",
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
      if (priorityError || !priorityData) {
        return res
          .status(404)
          .json({ success: false, message: "Priority not found" });
      }
      updateData.priority_id = priorityData.id;
    }
    const updatedSlot = await updateSlot(id, updateData);
    res.status(200).json({
      success: true,
      data: updatedSlot,
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
    const deleted = await deleteSlot(id);
    res.status(200).json({
      success: true,
      message: "Slot deleted successfully",
      data: deleted,
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
