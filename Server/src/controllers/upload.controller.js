import Image from "../models/Image.js";
import cloudinary from "../config/cloudinary.js";
import crypto from "crypto";

export const uploadImage = async (req, res) => {
  try {
    const { file } = req;
    const { watermark } = req.body;

    const uploaded = await cloudinary.uploader.upload(file.path, {
      transformation: [{ overlay: { text: watermark }, gravity: "south_east", opacity: 50 }],
    });

    const secureLink = crypto.randomBytes(12).toString("hex");

    const image = new Image({
      url: uploaded.secure_url,
      uploader: req.user.id,
      watermark,
      secureLink,
    });

    await image.save();
    res.json({ secureLink });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  }
};
