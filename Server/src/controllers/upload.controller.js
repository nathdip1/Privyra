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
       2️⃣ EXPIRY / VIEW SETTINGS (FROM UI)
    ----------------------------------- */
    const {
      expiresInMinutes,   // number | undefined
      maxViews,           // number | undefined
      oneTimeView         // boolean | undefined
    } = req.body;

    const expiresAt = expiresInMinutes
      ? new Date(Date.now() + Number(expiresInMinutes) * 60 * 1000)
      : null;

    const allowedViews = oneTimeView
      ? 1
      : maxViews
      ? Number(maxViews)
      : null;

    /* -----------------------------------
       3️⃣ FORENSIC IDENTIFIER (SERVER SIDE)
    ----------------------------------- */
    const forensicId = crypto
      .createHash("sha256")
      .update(`${req.user._id}-${Date.now()}`)
      .digest("hex");

    /* -----------------------------------
       4️⃣ CLOUDINARY UPLOAD
           DIAGONAL + TILED WATERMARK
    ----------------------------------- */
    const uploadStream = cloudinary.v2.uploader.upload_stream(
      {
        folder: "privyra_secure",

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
            flags: "tiled",
          },
        ],

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
           5️⃣ SAVE TO DATABASE
        ----------------------------------- */
        const image = await Image.create({
          url: uploadResult.secure_url,
          secureLink: uploadResult.secure_url,
          uploadedBy: req.user._id,
          watermark: watermarkText,
          forensicId,

          expiresAt,
          maxViews: allowedViews,
          views: 0,

          auditLog: [], // will be filled on view
        });

        res.json({ secureLink: image.secureLink });
      }
    );

    uploadStream.end(req.file.buffer);
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({ error: "Upload failed" });
  }
};
