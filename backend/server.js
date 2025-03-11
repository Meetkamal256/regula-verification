const express = require("express");
const cors = require("cors");
const fs = require("fs");
require("dotenv").config();

const faceRoutes = require("./routes/faceRoutes"); 

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Load the Regula license file
const licensePath = process.env.REGULA_LICENSE_PATH || "./licenses/regula.license";

if (!fs.existsSync(licensePath)) {
    console.error(`License file not found at ${licensePath}`);
    process.exit(1);
} else {
    console.log(`License file loaded from ${licensePath}`);
}

// Use face recognition routes
app.use("/api/face", faceRoutes);

// Default route
app.get("/", (req, res) => {
    res.send("Regula Face API Backend is Running!");
});

// Start the server
app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
});
