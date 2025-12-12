import cloudinary from "cloudinary";
import streamifier from "streamifier";
import Image from "../models/Image.js";

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.v2.uploader.upload_stream(
        { folder: "privyra_secure" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
    });

    const imageDoc = await Image.create({
      url: result.secure_url,
      secureLink: result.secure_url,
      uploadedBy: req.user._id,   // FIXED FIELD NAME
      watermark: req.body.watermark || "",
    });

    res.json({ secureLink: imageDoc.secureLink });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({ error: err.message || "Upload failed" });
  }
};
