const Lead = require("../models/leadModel");

module.exports.createLead = async (req, res) => {
  try {
    const { name, email, phone, feedback } = req.body;
    const lead = new Lead({ name, email, phone, feedback });
    await lead.save();

    res.status(201).send({
      success: 1,
      message: "Form Submitted"
    });
  } catch (error) {
    console.log(error.message);

    // Handle duplicate key error (E11000)
    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyValue)[0]; // email or phone
      return res.status(400).send({
        success: 0,
        message: `${duplicateField} already exists`,
        field: duplicateField 
      });
    }

    res.status(400).send({
      success: 0,
      message: error.message
    });
  }
};

// Fetch leads
module.exports.getLeads = async (req, res) => {
  try {
    let { page = 1, limit = 5 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const leads = await Lead.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalLeads = await Lead.countDocuments();

    res.send({
      totalLeads,
      totalPages: Math.ceil(totalLeads / limit),
      currentPage: page,
      leads,
    });
  } catch (error) {
    res.status(500).send({ message: "Error fetching leads", error });
  }
};

// Update lead status
module.exports.updateLeadStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["New", "Contacted"].includes(status)) {
      return res.status(400).send({
        success: 0,
        message: "Invalid status value"
      });
    }

    const lead = await Lead.findByIdAndUpdate(id, { status }, { new: true });

    if (!lead) {
      return res.status(404).send({
        success: 0,
        message: "Lead not found"
      });
    }

    res.status(200).send({
      success: 1,
      message: "Status Updated",
      lead
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Delete lead
module.exports.deleteLead = async (req, res) => {
  try {
    const { id } = req.params;

    const lead = await Lead.findByIdAndDelete(id);

    if (!lead) {
      return res.status(404).json({
        success: 0,
        error: "Lead not found",
      });
    }

    res.status(200).json({
      success: 1,
      message: "Lead deleted successfully",
      lead,
    });
  } catch (error) {
    console.error("Error deleting lead:", error);
    res.status(500).json({
      success: 0,
      error: "Server error while deleting lead",
    });
  }
};
