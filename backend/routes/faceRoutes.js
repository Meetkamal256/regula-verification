const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const licensePath = path.join(__dirname, "..", "licenses", "regula.license");

// Check if the license file exists when starting the server
if (!fs.existsSync(licensePath)) {
    console.error("❌ License file missing! Ensure regula.license is placed in the 'licenses' folder.");
}

// API route for face recognition
router.post("/recognize", (req, res) => {
    try {
        if (!fs.existsSync(licensePath)) {
            return res.status(500).json({ error: "License file missing!" });
        }
        
        // Simulating face recognition response
        return res.json({
            message: "Face recognition API is working with license!",
            status: "success",
        });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
