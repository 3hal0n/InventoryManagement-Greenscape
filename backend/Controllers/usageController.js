const UsageReport = require("../Model/usageModel.js");

// Get all usage reports
const getAllUsage = async (req, res) => {
    try {
        const usageReports = await UsageReport.find();
        if (!usageReports.length) {
            return res.status(404).json({ message: "No usage reports found" });
        }
        res.status(200).json({ usageReports });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error retrieving usage reports" });
    }
};

// Add a new usage report
const addUsageReport = async (req, res) => {
    try {
        const { projectName, itemId, itemName, quantityUsed, dateOfUsage, usedBy, purpose } = req.body;
        const newUsageReport = new UsageReport({ projectName, itemId, itemName, quantityUsed, dateOfUsage, usedBy, purpose });

        await newUsageReport.save();
        res.status(201).json({ usageReport: newUsageReport });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Unable to add new usage report" });
    }
};

// Get a usage report by ID
const getById = async (req, res) => {
    try {
        const usageReport = await UsageReport.findById(req.params.id);
        if (!usageReport) {
            return res.status(404).json({ message: "No usage report found with this ID" });
        }
        res.status(200).json({ usageReport });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error retrieving the usage report" });
    }
};

// Update a usage report
const updateUsageReport = async (req, res) => {
    try {
        const updatedUsageReport = await UsageReport.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true } // Returns updated document
        );
        if (!updatedUsageReport) {
            return res.status(404).json({ message: "No usage report found with this ID" });
        }
        res.status(200).json({ usageReport: updatedUsageReport });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error updating the usage report" });
    }
};

// Delete a usage report
const deleteUsageReport = async (req, res) => {
    try {
        const deletedUsageReport = await UsageReport.findByIdAndDelete(req.params.id);
        if (!deletedUsageReport) {
            return res.status(404).json({ message: "Usage report not found" });
        }
        res.status(200).json({ message: "Usage report deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Unable to delete usage report" });
    }
};

module.exports = {
    getAllUsage,
    addUsageReport,
    getById,
    updateUsageReport,
    deleteUsageReport
};
