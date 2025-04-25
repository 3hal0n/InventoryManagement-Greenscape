const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const maintenanceSchema = new Schema({
    itemId: {
        type: String,
        required: true
    },
    itemName: {
        type: String,
        required: true
    },
    maintenanceType: {
        type: String,
        required: true,
        enum: ["Repair", "Replacement", "Inspection", "Cleaning"]
    },
    maintenanceDate: {
        type: Date,
        required: true
    },
    performedBy: {
        type: String,
        required: true
    },
    cost: {
        type: Number,
        required: function () {
            return this.maintenanceType === "Repair" || this.maintenanceType === "Replacement";
        }
    },
    nextMaintenanceDate: {
        type: Date,
        required: false // Some maintenance might not need a scheduled next date
    },
    status: {
        type: String,
        required: true,
        enum: ["Pending", "Completed", "In Progress"]
    }
});

module.exports = mongoose.model("maintenanceModel", maintenanceSchema);
