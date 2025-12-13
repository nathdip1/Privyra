import Image from "../models/Image.js";

/*
  GET AUDIT LOG FOR AN IMAGE
  - Only uploader can access
*/
export const getImageAuditLog = async (req, res) => {
  try {
    const { id } = req.params;

    const image = await Image.findById(id)
      .select("secureLink views maxViews oneTimeView expiresAt accessLog uploadedBy")
      .populate("uploadedBy", "username");

    if (!image) {
      return res.status(404).json({ error: "Image not found" });
    }

    /* 🔐 Ownership check */
    if (image.uploadedBy._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Access denied" });
    }

    return res.json({
      imageId: image._id,
      secureLink: image.secureLink,
      views: image.views,
      maxViews: image.maxViews,
      oneTimeView: image.oneTimeView,
      expiresAt: image.expiresAt,
      auditLog: image.accessLog,
    });

  } catch (err) {
    console.error("AUDIT LOG ERROR:", err);
    return res.status(500).json({ error: "Failed to fetch audit log" });
  }
};
