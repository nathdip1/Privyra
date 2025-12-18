import crypto from "crypto";
import Upload from "../models/upload.model.js";
import { getGridFSBucket } from "../utils/gridfs.js";

/*
  UPLOAD CONTROLLER (BINARY, MOBILE-SAFE)
  - Accepts encrypted binary image
  - Accepts raw 12-byte IV
  - Enforces AES-GCM constraints at upload time
  - Stores encrypted bytes in GridFS
  - Stores IV as raw binary (Buffer)
*/

export const uploadImage = async (req, res) => {
  try {
    /* ===============================
       AUTH CHECK
    =============================== */
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    /* ===============================
       EXTRACT METADATA
    =============================== */
    const {
      mimeType,
      originalSize,
      expiresInMinutes,
      maxViews,
    } = req.body;

    /* ===============================
       EXTRACT FILES (BINARY)
    =============================== */
    const encryptedFile = req.files?.encryptedFile?.[0];
    const ivFile = req.files?.iv?.[0];
    console.log("REQ FILE KEYS:", Object.keys(req.files || {}));
console.log(
  "Encrypted file size:",
  encryptedFile?.size,
  "IV size:",
  ivFile?.size
);


    if (!encryptedFile || !ivFile || !mimeType) {
      return res.status(400).json({
        error: "Invalid encrypted payload",
      });
    }

    const encryptedBuffer = encryptedFile.buffer;
    const ivBuffer = ivFile.buffer;

    /* ===============================
       🔐 CRITICAL SECURITY CHECK
       AES-GCM requires exactly 12 bytes IV
    =============================== */
    if (!Buffer.isBuffer(ivBuffer) || ivBuffer.length !== 12) {
      return res.status(400).json({
        error: "Invalid IV length at upload",
      });
    }

    /* ===============================
       EXPIRY / VIEW LIMITS
    =============================== */
    const expiresAt = expiresInMinutes
      ? new Date(Date.now() + Number(expiresInMinutes) * 60 * 1000)
      : null;

    const allowedViews = maxViews ? Number(maxViews) : null;

    /* ===============================
       STORAGE
    =============================== */
    const token = crypto.randomUUID();
    const bucket = getGridFSBucket();

    const uploadStream = bucket.openUploadStream(token, {
      contentType: "application/octet-stream",
      metadata: {
        uploadedBy: req.user._id.toString(),
        mimeType,
        originalSize,
      },
    });

    uploadStream.end(encryptedBuffer);

    uploadStream.on("error", (err) => {
      console.error("GRIDFS ERROR:", err);
      return res.status(500).json({
        error: "File storage failed",
      });
    });

    uploadStream.on("finish", async () => {
      await Upload.create({
        token,
        fileId: uploadStream.id,
        uploadedBy: req.user._id,
        fileSize: originalSize,
        mimeType,
        iv: ivBuffer, // ✅ RAW 12-BYTE IV STORED
        expiresAt,
        maxViews: allowedViews,
        views: 0,
        revoked: false,
        viewLogs: [],
      });

      return res.json({
        viewLink: `/api/view/${token}`,
      });
    });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    return res.status(500).json({
      error: "Upload failed",
    });
  }
};
