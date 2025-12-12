import Image from "../models/Image.js";

export const viewImage = async (req, res) => {
  try {
    const { link } = req.params;

    // Find image by public_id or secureLink
    const image = await Image.findOne({ secureLink: link });
    if (!image) return res.status(404).json({ error: "Image not found" });

    image.views += 1;
    await image.save();

    // Redirect to Cloudinary URL
    res.redirect(image.url);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Cannot fetch image" });
  }
};
