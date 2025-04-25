const express = require("express");
const router = express.Router();
const maintenanceController = require("../Controllers/maintenanceController.js");


router.get("/", maintenanceController.getAllMaintenance);
router.post("/", maintenanceController.addMaintenanceRecord);
router.get("/:id", maintenanceController.getMaintenanceById);
router.put("/:id", maintenanceController.updateMaintenanceRecord);
router.delete("/:id", maintenanceController.deleteMaintenanceRecord);

module.exports = router;