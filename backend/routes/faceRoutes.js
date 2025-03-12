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

        faceSdk = FaceSdk;

        console.log("✅ Face SDK initialized successfully.");
    } catch (error) {
        console.error("❌ Error initializing Face SDK:", error);
        faceSdk = null;
    }
}

initializeFaceSDK();

// Face Matching Route
router.post("/match", upload.fields([{ name: "selfie" }, { name: "idPhoto" }]), async (req, res) => {
    try {
        if (!req.files || !req.files["selfie"] || !req.files["idPhoto"]) {
            return res.status(400).json({ error: "Both selfie and ID photo are required!" });
        }

        if (!faceSdk) {
            return res.status(500).json({ error: "Face SDK is not initialized yet!" });
        }

        const selfiePath = req.files["selfie"][0].path;
        const idPhotoPath = req.files["idPhoto"][0].path;

        console.log("📷 Received images:", selfiePath, idPhotoPath);

        const selfieBuffer = fs.readFileSync(selfiePath);
        const idPhotoBuffer = fs.readFileSync(idPhotoPath);

        const selfieBase64 = selfieBuffer.toString("base64");
        const idPhotoBase64 = idPhotoBuffer.toString("base64");
        
        // Perform face matching
        const response = await faceSdk.matchFaces({
            images: [
                { image: selfieBase64, type: 1 }, // Type 1: Selfie
                { image: idPhotoBase64, type: 3 }  // Type 3: Document photo
            ]
        });
        
        const similarity = response.similarity;
        const isMatch = similarity >= 85;
        
        return res.json({
            message: isMatch ? "Face Match Successful!" : "Faces do not match.",
            similarity,
            status: isMatch ? "success" : "failed"
        });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

export default router;
