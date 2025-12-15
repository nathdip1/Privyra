import Upload from "../models/upload.model.js";
import { getGridFSBucket } from "../utils/gridfs.js";
import mongoose from "mongoose";

/*
  ZERO-KNOWLEDGE VIEW CONTROLLER
  - Auth required
  - Enforces expiry / revoke / maxViews
  - Streams encrypted bytes
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
       STREAM ENCRYPTED DATA
    =============================== */
    const bucket = getGridFSBucket();

    if (!mongoose.Types.ObjectId.isValid(upload.fileId)) {
      return res.status(500).json({
        error: "Invalid file reference",
      });
    }

    const fileId = new mongoose.Types.ObjectId(upload.fileId);
    const downloadStream = bucket.openDownloadStream(fileId);

    const chunks = [];

    downloadStream.on("data", (chunk) => {
      chunks.push(chunk);
    });

    downloadStream.on("error", () => {
      return res.status(404).json({
        error: "Encrypted file not found",
      });
    });

    downloadStream.on("end", () => {
      const encryptedBuffer = Buffer.concat(chunks);

      res.json({
        encryptedData: encryptedBuffer.toString("base64"),
        iv: upload.iv,
        mimeType: upload.mimeType,
      });
    });
  } catch (err) {
    console.error("VIEW ERROR:", err);
    return res.status(500).json({
      error: "Failed to fetch encrypted data",
    });
  }
};
