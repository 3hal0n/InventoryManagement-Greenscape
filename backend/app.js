//pw-fnQsm550Po5uSTwb

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

//const router = require("./Routes/inventoryRoute.js");
const usageRouter = require("./Routes/usageRoute.js");
const inventoryRouter = require("./Routes/inventoryRoute.js");
const maintenanceRouter = require("./Routes/maintenanceRoute.js");
const authRouter = require("./Routes/authRoute.js");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

//Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increase payload limit for PDF data
//app.use("/inventories", router);
app.use("/inventories", inventoryRouter);
//app.use("/usageRouters", usageRouter);
app.use("/usage", usageRouter);
app.use("/maintenance", maintenanceRouter);
app.use("/auth", authRouter);

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Make io accessible to our routes
app.set('io', io);

// Low stock notification function
const checkLowStock = async () => {
    try {
        const Inventory = require('./Model/inventoryModel');
        const lowStockItems = await Inventory.find({
            $expr: { $lte: ["$quantity", "$reorderLevel"] }
        });

        if (lowStockItems.length > 0) {
            io.emit('lowStockAlert', {
                items: lowStockItems.map(item => ({
                    itemName: item.itemName,
                    currentQuantity: item.quantity,
                    reorderLevel: item.reorderLevel
                }))
            });
        }
    } catch (error) {
        console.error('Error checking low stock:', error);
    }
};

// Check low stock every 5 minutes
setInterval(checkLowStock, 5 * 60 * 1000);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    server.listen(5000, () => console.log("Server running on port 5000"));
  })
  .catch((err) => console.log(err));
