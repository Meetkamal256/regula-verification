import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname } from "path";
import * as FaceSdk from "@regulaforensics/facesdk-webclient"; 

dotenv.config();

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const licensePath = path.join(__dirname, "../licenses/regula.license");

const upload = multer({ dest: "uploads/" });
let faceSdk = null;

async function initializeFaceSDK() {
    try {
        if (!fs.existsSync(licensePath)) {
            console.error("License file missing!");
            process.exit(1);
        }
        
        console.log(`✅ License file loaded from: ${licensePath}`);
        const licenseData = fs.readFileSync(licensePath, "utf-8");
        
        //  Correct way to assign SDK
        faceSdk = FaceSdk; 
        
        console.log("✅ Face SDK initialized successfully.");
    } catch (error) {
        console.error("❌ Error initializing Face SDK:", error);
        faceSdk = null;
    }
}

initializeFaceSDK();

// Face Recognition Route
router.post("/recognize", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No image uploaded!" });
        }
        
        if (!faceSdk) {
            return res.status(500).json({ error: "Face SDK is not initialized yet!" });
        }
        
        console.log("📷 Received image:", req.file.path);
        const imageBuffer = fs.readFileSync(req.file.path);
        const imageBase64 = imageBuffer.toString("base64");
        
        // Perform face detection
        const response = await faceSdk.detectFaces({ image: imageBase64 });
        
        return res.json({
            message: response.faces.length > 0 ? "✅ Face detected!" : "❌ No face detected.",
            faces: response.faces,
            status: response.faces.length > 0 ? "success" : "failed",
        });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

export default router;
