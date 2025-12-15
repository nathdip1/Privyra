import crypto from "crypto";
import Upload from "../models/upload.model.js";
import { getGridFSBucket } from "../utils/gridfs.js";

export const uploadImage = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const {
      encryptedData,
      iv,
      mimeType,
      originalSize,
      expiresInMinutes,
      maxViews,
    } = req.body;

    if (!encryptedData || !iv || !mimeType) {
      return res.status(400).json({
        error: "Invalid encrypted payload",
      });
    }

    const encryptedBuffer = Buffer.from(encryptedData, "base64");

    const expiresAt = expiresInMinutes
      ? new Date(Date.now() + Number(expiresInMinutes) * 60 * 1000)
      : null;

    const allowedViews = maxViews ? Number(maxViews) : null;

    const token = crypto.randomUUID();

    const bucket = getGridFSBucket();

    const uploadStream = bucket.openUploadStream(token, {
      contentType: "application/octet-stream",
      metadata: {
        uploadedBy: req.user._id.toString(),
        iv,
        mimeType,
        originalSize,
      },
    });

    uploadStream.end(encryptedBuffer);

    uploadStream.on("error", () => {
      return res.status(500).json({
        error: "File storage failed",
      });
    });

    uploadStream.on("finish", async () => {
      const upload = await Upload.create({
        token,
        fileId: uploadStream.id,
        uploadedBy: req.user._id,
        fileSize: originalSize,
        mimeType,
        iv, // ✅ FIX
        expiresAt,
        maxViews: allowedViews,
        views: 0,
        revoked: false,
        viewLogs: [],
      });

      res.json({
        viewLink: `/api/view/${upload.token}`,
      });
    });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({ error: "Upload failed" });
  }
};
