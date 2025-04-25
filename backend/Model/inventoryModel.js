const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const inventorySchema=new Schema({
    itemName:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    quantity:{
        type:Number,
        required:true,
    },
    supplier:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    maintenanceSchedule:{
        type:String,
        required:true,
    },
    reorderLevel: {
        type: Number,
        required: true,
        default: 0
    },
    reorderAmount: {
        type: Number,
        required: true,
        default: 0
    },
});

module.exports=mongoose.model(
    "inventoryModel",
    inventorySchema
)