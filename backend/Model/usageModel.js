const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const usageSchema = new Schema({
    projectName: {
        type: String,
        required: true,
    },
    itemId: {
        type: String,
        required: true,
    },
    itemName: {
        type: String,
        required: true,
    },
    quantityUsed: {
        type: Number,
        required: true,
    },
    dateOfUsage: {
        type: Date,
        required: true,
    },
    usedBy: {
        type: String,
        required: true,
    },
    purpose: {
        type: String,
        required: false,
    },
});

module.exports = mongoose.model("UsageReport", usageSchema);
