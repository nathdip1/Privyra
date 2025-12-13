import Image from "../models/Image.js";

export const getMyUploads = async (req, res) => {
  try {
    const userId = req.user._id;

    const images = await Image.find({ uploadedBy: userId })
      .sort({ createdAt: -1 })
      .select(
        "secureLink views maxViews oneTimeView expiresAt createdAt"
      );

    res.json(images);
  } catch (err) {
    console.error("DASHBOARD ERROR:", err);
    res.status(500).json({ error: "Failed to fetch uploads" });
  }
};

/* 🔥 Revoke link manually */
export const revokeLink = async (req, res) => {
  try {
    const { id } = req.params;

    const image = await Image.findOne({
      _id: id,
      uploadedBy: req.user._id,
    });

    if (!image) {
      return res.status(404).json({ error: "Image not found" });
    }

    image.expiresAt = new Date(); // expire immediately
    await image.save();

    res.json({ message: "Link revoked" });
  } catch (err) {
    console.error("REVOKE ERROR:", err);
    res.status(500).json({ error: "Failed to revoke link" });
  }
};
