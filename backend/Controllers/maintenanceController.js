const Maintenance = require("../Model/maintenanceModel.js");

// Get all maintenance records
const getAllMaintenance = async (req, res) => {
    try {
        const maintenanceRecords = await Maintenance.find();
        if (!maintenanceRecords.length) {
            return res.status(404).json({ message: "No maintenance records found" });
        }
        res.status(200).json({ maintenanceRecords });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error retrieving maintenance records" });
    }
};

// Add a new maintenance record
const addMaintenanceRecord = async (req, res) => {
    try {
        const { itemId, itemName, maintenanceType, maintenanceDate, performedBy, cost, nextMaintenanceDate, status } = req.body;
        const newMaintenanceRecord = new Maintenance({ itemId, itemName, maintenanceType, maintenanceDate, performedBy, cost, nextMaintenanceDate, status });

        await newMaintenanceRecord.save();
        res.status(201).json({ maintenanceRecord: newMaintenanceRecord });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Unable to add new maintenance record" });
    }
};

// Get a maintenance record by ID
const getMaintenanceById = async (req, res) => {
    try {
        const maintenanceRecord = await Maintenance.findById(req.params.id);
        if (!maintenanceRecord) {
            return res.status(404).json({ message: "No maintenance record found with this ID" });
        }
        res.status(200).json({ maintenanceRecord });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error retrieving the maintenance record" });
    }
};

// Update a maintenance record
const updateMaintenanceRecord = async (req, res) => {
    try {
        const updatedMaintenanceRecord = await Maintenance.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true } // Returns updated document
        );
        if (!updatedMaintenanceRecord) {
            return res.status(404).json({ message: "No maintenance record found with this ID" });
        }
        res.status(200).json({ maintenanceRecord: updatedMaintenanceRecord });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error updating the maintenance record" });
    }
};

// Delete a maintenance record
const deleteMaintenanceRecord = async (req, res) => {
    try {
        const deletedMaintenanceRecord = await Maintenance.findByIdAndDelete(req.params.id);
        if (!deletedMaintenanceRecord) {
            return res.status(404).json({ message: "Maintenance record not found" });
        }
        res.status(200).json({ message: "Maintenance record deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Unable to delete maintenance record" });
    }
};

module.exports = {
    getAllMaintenance,
    addMaintenanceRecord,
    getMaintenanceById,
    updateMaintenanceRecord,
    deleteMaintenanceRecord
};
