//pw-fnQsm550Po5uSTwb

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

//const router = require("./Routes/inventoryRoute.js");
const usageRouter = require("./Routes/usageRoute.js");
const inventoryRouter = require("./Routes/inventoryRoute.js");
const maintenanceRouter = require("./Routes/maintenanceRoute.js");

const app = express();

//Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increase payload limit for PDF data
//app.use("/inventories", router);
app.use("/inventories", inventoryRouter);
//app.use("/usageRouters", usageRouter);
app.use("/usage", usageRouter);
app.use("/maintenance", maintenanceRouter);

mongoose.connect("mongodb+srv://username:newpassword@cluster.mongodb.net/yourdb?retryWrites=true&w=majority")//Enter your mongodb link
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(5000, () => console.log("Listening on port 5000"));
  })
  .catch((err) => console.log(err));
