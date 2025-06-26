const inventory=require("../Model/inventoryModel.js")
const nodemailer = require("nodemailer");
require('dotenv').config();

// Email configuration
const emailUser = process.env.EMAIL || 'greenscape1234@gmail.com';
const emailPassword = process.env.EMAIL_PASSWORD;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: emailUser,
        pass: emailPassword
    }
});

// Send email with PDF
const sendEmail = async (req, res) => {
    try {
        const { pdfData, recipientEmail } = req.body;
        
        if (!pdfData || !recipientEmail) {
            return res.status(400).json({ 
                message: "Missing required data",
                details: "Both PDF data and recipient email are required"
            });
        }

        if (!emailPassword) {
            return res.status(500).json({
                message: "Email configuration error",
                details: "Email password is not configured"
            });
        }

        // Convert base64 to buffer
        const pdfBuffer = Buffer.from(pdfData, 'base64');

        const mailOptions = {
            from: emailUser,
            to: recipientEmail,
            subject: 'Low Stock Alerts Report',
            text: 'Please find attached the low stock alerts report.',
            attachments: [{
                filename: 'low_stock_alerts_report.pdf',
                content: pdfBuffer,
                contentType: 'application/pdf'
            }]
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ 
            message: "Email sent successfully"
        });
    } catch (error) {
        res.status(500).json({ 
            message: "Failed to send email",
            details: error.message
        });
    }
};

//Data display
const getAllInventories=async(req, res, next)=>{
    let inventories;
    //Get all inventories
    try{
        inventories=await inventory.find();
    }
    catch(err){
        console.log(err);
    }
    //If not found
    if(!inventories){
        return res.status(404).json({message:"No inventory items found"})
    }
    //Display all inventory items
    return res.status(200).json({inventories});
};

//Data insertion
const addInventories=async(req, res, next)=> {
    const {itemName, category, quantity, supplier, price, maintenanceSchedule}=req.body;
    let newInventory;
    try{
        newInventory=new inventory({itemName, category, quantity, supplier, price, maintenanceSchedule});
        await newInventory.save();
    
    // Respond with the created item
    return res.status(201).json({ inventory: newInventory });
  } catch (err) {
    console.error(err); //Log errors
    return res.status(500).json({ message: "Unable to add inventory item" }); //Handle server errors
  }
}
 
//Get by ID
const getById = async (req, res, next) => {
    const itemId = req.params.itemId; 
  
    let Inventory;
    try {
      //Find the inventory item by ID
      Inventory = await inventory.findById(itemId);
  
      if (!Inventory) {
        //If no inventory item is found
        return res.status(404).json({ message: "No inventory item found with this ID" });
      }
  
      //If found, return the item
      return res.status(200).json({ inventory: Inventory });
    } catch (err) {
      console.error(err); //Log the error for debugging
      return res.status(500).json({ message: "An error occurred while retrieving the inventory item" }); //Handle server errors
    }
  };

  //Update inventory
const updateInventory=async(req, res, next)=> {
  const itemId=req.params.itemId;
  const{itemName, category, quantity, supplier, price, maintenanceSchedule}=req.body;

  try{
      const updatedInventory = await inventory.findByIdAndUpdate(
          itemId,
          { itemName, category, quantity, supplier, price, maintenanceSchedule },
          { new: true }//Return updated document
          );
      if (!updatedInventory){
          return res.status(404).json({message:"No inventory item found with this ID"});
      }

      return res.status(200).json({inventory: updatedInventory});
  }catch (err){
      console.error(err);
      return res.status(500).json({message: "An error occurred while updating the inventory item"});
  }
};
//Delete Inventory
const deleteInventoryItem= async(req,res)=>{
  const itemId=req.params.itemId;

  try{
    const deletedInventory=await inventory.findByIdAndDelete(itemId);
      if(!deletedInventory){
        return res.status(404).json({message:"Inventory item not found"});
      }
      return res.status(200).json({message:"Inventory item deleted successfully",inventory:deletedInventory});
    }
    catch(err){
      console.log(err);
      return res.status(500).json({message:"Unable to delete inventory item"});
  }
}; 
//Update reoder level
const updateReorderLevel = async (req, res, next) => {
  const itemId = req.params.itemId;
  const { reorderLevel } = req.body;

  if (typeof reorderLevel !== 'number' || reorderLevel <= 0) {
      return res.status(400).json({ message: 'Reorder level must be a positive number' });
  }

  try {
      const updatedItem = await inventory.findByIdAndUpdate(
          itemId,
          { reorderLevel },
          { new: true, runValidators: true }
      );

      if (!updatedItem) {
          return res.status(404).json({ message: 'Inventory item not found' });
      }

      return res.status(200).json(updatedItem);
  } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error updating reorder level" });
  }
};

//Update reorder amount
const updateReorderAmount = async (req, res, next) => {
    const itemId = req.params.itemId;
    const { reorderAmount } = req.body;
  
    // Validate reorderAmount
    if (typeof reorderAmount !== 'number' || reorderAmount <= 0) {
      return res.status(400).json({ message: 'Reorder amount must be a positive number' });
    }
  
    try {
      const updatedItem = await inventory.findByIdAndUpdate(
        itemId,
        { reorderAmount },
        { new: true, runValidators: true }
      );
  
      if (!updatedItem) {
        return res.status(404).json({ message: 'Inventory item not found' });
      }
  
      return res.status(200).json(updatedItem);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error updating reorder amount' });
    }
  };
  

module.exports = {
    getAllInventories,
    getById,
    addInventories,
    updateInventory,
    deleteInventoryItem,
    updateReorderLevel,
    sendEmail,
    updateReorderAmount
};