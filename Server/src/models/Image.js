import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // FIXED
  watermark: { type: String },
  secureLink: { type: String, required: true, unique: true },
  views: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model("Image", imageSchema);
