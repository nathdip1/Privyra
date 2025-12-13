import Upload from "../models/upload.model.js";

/*
  VIEW IMAGE CONTROLLER (ATOMIC + AUDITED)
  - Requires authenticated user
  - Enforces expiry
  - Enforces max views
  - Enforces revoke
  - Tracks per-user view count
*/
export const viewImage = async (req, res) => {
  try {
    const { link } = req.params;
    const now = new Date();

    // 🔐 Enforce login
    if (!req.user) {
      return res.status(401).json({
        error: "Authentication required to view this image",
      });
    }

    /* ==================================================
       FIND UPLOAD
    ================================================== */
    const upload = await Upload.findOne({
      secureLink: link,
    });

    if (!upload) {
      return res.status(404).json({
        error: "Invalid or expired link",
      });
    }

    /* ==================================================
       BLOCK CONDITIONS
    ================================================== */
    if (upload.revoked) {
      return res.status(410).json({
        error: "This link has been revoked by the owner",
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

    /* ==================================================
       PER-USER VIEW TRACKING
    ================================================== */
    const viewerId = req.user.id;
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

    /* ==================================================
       GLOBAL VIEW COUNT
    ================================================== */
    upload.views += 1;

    await upload.save();

    /* ==================================================
       REDIRECT TO IMAGE
    ================================================== */
    return res.redirect(upload.url);
  } catch (err) {
    console.error("VIEW ERROR:", err);
    return res.status(500).json({
      error: "Cannot fetch image",
    });
  }
};
