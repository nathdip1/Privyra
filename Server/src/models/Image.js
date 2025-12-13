import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    /* ===============================
       CORE IMAGE DATA
    =============================== */
    url: {
      type: String,
      required: true,
    },

    secureLink: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    watermark: {
      type: String,
    },

    /* ===============================
       ACCESS CONTROL
    =============================== */

    // Total views so far
    views: {
      type: Number,
      default: 0,
    },

    // Max allowed views (null = unlimited)
    maxViews: {
      type: Number,
      default: null,
    },

    // One-time view shortcut
    oneTimeView: {
      type: Boolean,
      default: false,
    },

    /* ===============================
       EXPIRY CONTROL
    =============================== */

    // Absolute expiry time
    expiresAt: {
      type: Date,
      default: null,
      index: true,
    },

    /* ===============================
       FORENSIC / AUDIT
    =============================== */

    forensicId: {
      type: String,
      index: true,
    },

    accessLog: [
      {
        accessedAt: {
          type: Date,
          default: Date.now,
        },
        ip: String,
        userAgent: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

/* ===============================
   TTL INDEX (AUTO DELETE)
   (Only deletes if expiresAt exists)
================================ */
imageSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0, partialFilterExpression: { expiresAt: { $ne: null } } }
);

export default mongoose.model("Image", imageSchema);
