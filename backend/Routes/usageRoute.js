const express = require("express");
const router = express.Router();
const usageController = require("../Controllers/usageController.js");
const { verifyToken, checkRole } = require("../middleware/auth");

// Protected routes - all users can view
router.get("/", verifyToken, usageController.getAllUsage);
router.get("/:id", verifyToken, usageController.getById);

// Protected routes - only admin and manager can modify
router.post("/", verifyToken, checkRole(['admin', 'manager']), usageController.addUsageReport);
router.put("/:id", verifyToken, checkRole(['admin', 'manager']), usageController.updateUsageReport);
router.delete("/:id", verifyToken, checkRole(['admin', 'manager']), usageController.deleteUsageReport);

module.exports = router;
