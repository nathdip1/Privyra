import Upload from "../models/upload.model.js";
import { getGridFSBucket } from "../utils/gridfs.js";
import mongoose from "mongoose";

/*
  ZERO-KNOWLEDGE VIEW CONTROLLER (BINARY)
  - Auth required
  - Enforces expiry / revoke / maxViews
  - Streams encrypted bytes (NO base64)
  - NEVER decrypts
*/
export const viewImage = async (req, res) => {
  try {
    const { token } = req.params;
    const now = new Date();

    /* ===============================
       AUTH CHECK
    =============================== */
    if (!req.user) {
      return res.status(401).json({
        error: "Authentication required",
      });
    }

    /* ===============================
       FIND UPLOAD
    =============================== */
    const upload = await Upload.findOne({ token });

    if (!upload) {
      return res.status(404).json({
        error: "Invalid or expired link",
      });
    }

    /* ===============================
       SECURITY RULES
    =============================== */
    if (upload.revoked) {
      return res.status(410).json({
        error: "This link has been revoked",
      });
    }

    if (upload.expiresAt && upload.expiresAt < now) {
      return res.status(410).json({
        error: "This link has expired",
      });
    }

    if (
      upload.maxViews !== null &&
      upload.views >= upload.maxViews
    ) {
      return res.status(410).json({
        error: "This link has reached its view limit",
      });
    }

    /* ===============================
       VIEW TRACKING
    =============================== */
    const viewerId = req.user._id.toString();
    const viewerUsername = req.user.username;

    const existingLog = upload.viewLogs.find(
      (v) => v.viewerId.toString() === viewerId
    );

    if (existingLog) {
      existingLog.viewCount += 1;
      existingLog.lastViewedAt = now;
    } else {
      upload.viewLogs.push({
        viewerId,
        viewerUsername,
        viewCount: 1,
        lastViewedAt: now,
      });
    }

    upload.views += 1;
    await upload.save();

    /* ===============================
       STREAM ENCRYPTED DATA (BINARY)
    =============================== */
    const bucket = getGridFSBucket();

    if (!mongoose.Types.ObjectId.isValid(upload.fileId)) {
      return res.status(500).json({
        error: "Invalid file reference",
      });
    }

    const fileId = new mongoose.Types.ObjectId(upload.fileId);
    const downloadStream = bucket.openDownloadStream(fileId);
    req.on("close", () => {
  downloadStream.destroy();
});


    // 🔐 Metadata in headers (small, safe)
    // 🔐 Normalize IV safely (AES-GCM requires exactly 12 bytes)
const ivBuffer = Buffer.isBuffer(upload.iv)
  ? upload.iv
  : Buffer.from(upload.iv);

// 🔐 Enforce AES-GCM IV length strictly
if (ivBuffer.length !== 12) {
  return res.status(410).json({
    error:
      "This link was generated using an older encryption format and is no longer supported. Please upload the image again.",
  });
}

res.setHeader("Content-Type", "application/octet-stream");
res.setHeader("X-IV", ivBuffer.toString("base64"));
res.setHeader("X-Mime-Type", upload.mimeType);



    downloadStream.on("error", () => {
      return res.status(404).json({
        error: "Encrypted file not found",
      });
    });

    // 🔐 Pipe encrypted bytes directly
    downloadStream.pipe(res);
  } catch (err) {
    console.error("VIEW ERROR:", err);
    return res.status(500).json({
      error: "Failed to fetch encrypted data",
    });
  }
};
