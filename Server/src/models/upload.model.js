import mongoose from "mongoose";

const viewLogSchema = new mongoose.Schema({
  viewerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  viewerUsername: String,
  viewCount: {
    type: Number,
    default: 1,
  },
  lastViewedAt: {
    type: Date,
    default: Date.now,
  },
});

const uploadSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
    },

    fileId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    fileSize: Number,

    mimeType: String,

    // ✅ CRITICAL FIX
    iv: {
      type: String,
      required: true,
    },

    expiresAt: Date,

    maxViews: {
      type: Number,
      default: null,
    },

    views: {
      type: Number,
      default: 0,
    },

    revoked: {
      type: Boolean,
      default: false,
    },

    viewLogs: [viewLogSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Upload", uploadSchema);
