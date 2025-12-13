import mongoose from "mongoose";

const viewLogSchema = new mongoose.Schema(
  {
    viewerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    viewerUsername: {
      type: String,
      required: true,
    },
    viewCount: {
      type: Number,
      default: 1,
    },
    lastViewedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const uploadSchema = new mongoose.Schema(
  {
    // Cloudinary URL
    url: {
      type: String,
      required: true,
    },

    // Owner of the upload
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Optional watermark text
    watermark: {
      type: String,
    },

    // Secure access link
    secureLink: {
      type: String,
      required: true,
      unique: true,
    },

    // Total number of views (all users)
    views: {
      type: Number,
      default: 0,
    },

    // Optional max views limit
    maxViews: {
      type: Number,
      default: null,
    },

    // Optional expiry time
    expiresAt: {
      type: Date,
      default: null,
    },

    // Manual revoke flag
    revoked: {
      type: Boolean,
      default: false,
    },

    // 🔐 NEW: Per-user view tracking
    viewLogs: {
      type: [viewLogSchema],
      default: [],
    },
  },
  {
    timestamps: true, // keeps createdAt & updatedAt (matches your data)
  }
);

const Upload = mongoose.model("Upload", uploadSchema);

export default Upload;
