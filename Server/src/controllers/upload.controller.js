import cloudinary from "cloudinary";
import crypto from "crypto";
import Image from "../models/Image.js";

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    /* -----------------------------------
       1️⃣ WATERMARK TEXT
    ----------------------------------- */
    const userText = req.body.watermark?.trim();
    const watermarkText = userText
      ? `Privyra • ${userText}`
      : "Privyra";

    /* -----------------------------------
       2️⃣ FORENSIC IDENTIFIER (SERVER SIDE)
       (Not visible, stored in DB)
    ----------------------------------- */
    const forensicId = crypto
      .createHash("sha256")
      .update(`${req.user._id}-${Date.now()}`)
      .digest("hex");

    /* -----------------------------------
       3️⃣ CLOUDINARY UPLOAD WITH
           DIAGONAL + TILED WATERMARK
    ----------------------------------- */
    const result = await cloudinary.v2.uploader.upload_stream(
      {
        folder: "privyra_secure",

        /* 🔥 Visible diagonal repeated watermark */
        transformation: [
          {
            overlay: {
              font_family: "Arial",
              font_size: 40,
              text: watermarkText,
            },
            color: "white",
            opacity: 40,
            angle: -30,
            gravity: "center",
            flags: "layer_apply",
          },
          {
            flags: "tiled", // 🔁 repeat watermark across image
          },
        ],

        /* 🔐 Metadata watermark (basic forensic) */
        context: {
          forensic_id: forensicId,
          owner: req.user.username || req.user._id.toString(),
        },

        resource_type: "image",
      },
      async (error, uploadResult) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          return res.status(500).json({ error: "Upload failed" });
        }

        /* -----------------------------------
           4️⃣ SAVE TO DATABASE
        ----------------------------------- */
        const image = await Image.create({
          url: uploadResult.secure_url,
          secureLink: uploadResult.secure_url,
          uploadedBy: req.user._id,
          watermark: watermarkText,
          forensicId,
        });

        res.json({ secureLink: image.secureLink });
      }
    );

    /* Pipe buffer to Cloudinary */
    result.end(req.file.buffer);
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({ error: "Upload failed" });
  }
};
