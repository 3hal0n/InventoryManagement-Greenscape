const express=require("express");
const router=express.Router();

//Insert Model
const inventory=require("../Model/inventoryModel.js")
//Insert Controller
const inventoryController=require("../Controllers/inventoryController.js")

router.get("/",inventoryController.getAllInventories);
router.post("/",inventoryController.addInventories);
router.get("/:itemId",inventoryController.getById);
router.put("/:itemId",inventoryController.updateInventory);
router.delete("/:itemId",inventoryController.deleteInventoryItem);
router.put('/:itemId/reorder-level', inventoryController.updateReorderLevel);
router.put('/:itemId/reorder-amount', inventoryController.updateReorderAmount);
router.post("/send-email", inventoryController.sendEmail);


//Export
module.exports=router;


  