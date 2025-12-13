import Image from "../models/Image.js";

/*
  VIEW IMAGE CONTROLLER (ATOMIC)
  - Enforces expiry
  - Enforces max views
  - Enforces one-time view
  - Logs access
  - Prevents race conditions
*/
export const viewImage = async (req, res) => {
  try {
    const { link } = req.params;
    const now = new Date();

    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.socket.remoteAddress;

    const userAgent = req.headers["user-agent"];

    /* ==================================================
       ATOMIC QUERY CONDITIONS
    ================================================== */
    const query = {
      secureLink: link,

      // ⏰ Expiry
      $or: [
        { expiresAt: null },
        { expiresAt: { $gt: now } },
      ],

      // 👁 View limits
      $expr: {
        $or: [
          { $eq: ["$maxViews", null] },
          { $lt: ["$views", "$maxViews"] },
        ],
      },
    };

    /* ==================================================
       ATOMIC UPDATE
    ================================================== */
    const update = {
      $inc: { views: 1 },
      $push: {
        accessLog: {
          accessedAt: now,
          ip,
          userAgent,
        },
      },
    };

    const image = await Image.findOneAndUpdate(
      query,
      update,
      { new: true }
    );

    /* ==================================================
       BLOCK CONDITIONS
    ================================================== */
    if (!image) {
      return res.status(410).json({
        error: "This link has expired or reached its view limit",
      });
    }

    /* ==================================================
       ONE-TIME VIEW ENFORCEMENT
    ================================================== */
    if (image.oneTimeView && image.views > 1) {
      return res.status(410).json({
        error: "This image was already viewed",
      });
    }

    /* ==================================================
       REDIRECT TO IMAGE
    ================================================== */
    return res.redirect(image.url);

  } catch (err) {
    console.error("VIEW ERROR:", err);
    return res.status(500).json({
      error: "Cannot fetch image",
    });
  }
};
