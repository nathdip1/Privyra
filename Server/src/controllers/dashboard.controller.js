import Upload from "../models/upload.model.js";

export const getMyUploads = async (req, res) => {
  try {
    const userId = req.user.id; // ✅ FIX

    const uploads = await Upload.find({ uploadedBy: userId })
      .sort({ createdAt: -1 })
      .select(
        "secureLink url views maxViews expiresAt revoked createdAt viewLogs"
      );

    res.json(uploads);
  } catch (err) {
    console.error("DASHBOARD ERROR:", err);
    res.status(500).json({ error: "Failed to fetch uploads" });
  }
};

export const revokeLink = async (req, res) => {
  try {
    const { id } = req.params;

    const upload = await Upload.findOne({
      _id: id,
      uploadedBy: req.user.id, // ✅ FIX
    });

    if (!upload) {
      return res.status(404).json({ error: "Upload not found" });
    }

    upload.revoked = true;
    upload.expiresAt = new Date();
    await upload.save();

    res.json({ message: "Link revoked" });
  } catch (err) {
    console.error("REVOKE ERROR:", err);
    res.status(500).json({ error: "Failed to revoke link" });
  }
};
