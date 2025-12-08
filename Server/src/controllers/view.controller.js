import Image from "../models/Image.js";

export const viewImage = async (req, res) => {
  try {
    const { link } = req.params;
    const image = await Image.findOne({ secureLink: link });
    if (!image) return res.status(404).json({ error: "Image not found" });

    image.views += 1;
    await image.save();

    res.redirect(image.url); // for frontend to display
  } catch (err) {
    res.status(500).json({ error: "Cannot fetch image" });
  }
};
